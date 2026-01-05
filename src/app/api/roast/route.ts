import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export const maxDuration = 60;

// ─── Simple in-memory rate limiter ──────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;          // max requests
const RATE_WINDOW = 60 * 1000; // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Zod schema for AI response validation ──────────────────────────────────
const SeveritySchema = z.enum(["critical", "warning", "good"]);

const SectionSchema = z.object({
  title: z.string(),
  score: z.number().min(0).max(100),
  severity: SeveritySchema,
  feedback: z.string(),
  tips: z.array(z.string()),
});

const RoastReportSchema = z.object({
  atsScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  topStrengths: z.array(z.string()),
  criticalFixes: z.array(z.string()),
  quickWins: z.array(z.string()),
  sections: z.array(SectionSchema),
});

// ─── Prompt ─────────────────────────────────────────────────────────────────
const PROMPT = (jobTitle: string, jobDescription: string) => `
You are a brutally honest but constructive senior recruiter and career coach with 15+ years of experience.

Analyze the uploaded CV for the role of "${jobTitle}".

JOB DESCRIPTION:
${jobDescription}

Respond ONLY with a valid JSON object matching this exact structure (no markdown, no explanation outside JSON):

{
  "atsScore": <number 0-100>,
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence brutally honest overall summary>",
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "criticalFixes": ["<fix 1>", "<fix 2>", "<fix 3>"],
  "quickWins": ["<quick win 1>", "<quick win 2>", "<quick win 3>"],
  "sections": [
    {
      "title": "Contact & Header",
      "score": <0-100>,
      "severity": "<critical|warning|good>",
      "feedback": "<specific feedback>",
      "tips": ["<tip 1>", "<tip 2>"]
    },
    {
      "title": "Professional Summary",
      "score": <0-100>,
      "severity": "<critical|warning|good>",
      "feedback": "<specific feedback>",
      "tips": ["<tip 1>", "<tip 2>"]
    },
    {
      "title": "Work Experience",
      "score": <0-100>,
      "severity": "<critical|warning|good>",
      "feedback": "<specific feedback>",
      "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
    },
    {
      "title": "Skills & Technologies",
      "score": <0-100>,
      "severity": "<critical|warning|good>",
      "feedback": "<specific feedback>",
      "tips": ["<tip 1>", "<tip 2>"]
    },
    {
      "title": "Education",
      "score": <0-100>,
      "severity": "<critical|warning|good>",
      "feedback": "<specific feedback>",
      "tips": ["<tip 1>"]
    },
    {
      "title": "ATS Compatibility",
      "score": <0-100>,
      "severity": "<critical|warning|good>",
      "feedback": "<specific feedback about keywords, formatting, parsing>",
      "tips": ["<tip 1>", "<tip 2>"]
    }
  ]
}
`;

// ─── Route handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const bytes = await file.arrayBuffer();
    const base64Pdf = Buffer.from(bytes).toString("base64");

    // Timeout wrapper: abort if Gemini takes > 55s (inside maxDuration)
    const geminiPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { inlineData: { mimeType: "application/pdf", data: base64Pdf } },
        { text: PROMPT(jobTitle, jobDescription) },
      ],
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("AI analysis timed out. Please try again.")),
        55000
      )
    );

    const response = await Promise.race([geminiPromise, timeoutPromise]);
    const rawText = response.text ?? "";

    console.log("[GEMINI] Raw response length:", rawText.length);

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(
          { error: "Failed to parse AI response" },
          { status: 500 }
        );
      }
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        return NextResponse.json(
          { error: "Failed to parse AI response" },
          { status: 500 }
        );
      }
    }

    // Zod validation — ensures type safety at runtime
    const validation = RoastReportSchema.safeParse(parsed);
    if (!validation.success) {
      console.error("[GEMINI] Schema validation failed:", validation.error.flatten());
      return NextResponse.json(
        { error: "AI returned an unexpected response format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(validation.data);
  } catch (error) {
    console.error("[GEMINI_ANALYZE_ERROR]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
