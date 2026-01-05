import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { RoastReport } from "@/types";

interface RoastPayload {
  file: File;
  jobTitle: string;
  jobDescription: string;
}

async function roastCV(payload: RoastPayload): Promise<RoastReport> {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("jobTitle", payload.jobTitle);
  formData.append("jobDescription", payload.jobDescription);

  // Do NOT pass Content-Type manually — axios sets it automatically
  // with the correct multipart boundary when a FormData body is detected.
  const { data } = await apiClient.post<RoastReport>("/roast", formData);

  return data;
}

export function useRoastCV() {
  return useMutation({
    mutationFn: roastCV,
  });
}
