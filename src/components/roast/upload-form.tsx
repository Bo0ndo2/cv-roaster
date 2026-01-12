"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { uploadSchema } from "@/lib/validations";
import { useRoastCV } from "@/hooks/use-roast-cv";
import { useRoast } from "@/context/roast-context";
import { UploadFormValues } from "@/types";
import { FileText, Upload, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const initialValues: UploadFormValues = { jobTitle: "", jobDescription: "" };

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const { setReport, setLoading, setError } = useRoast();
  const { mutateAsync, isPending } = useRoastCV();

  const onDrop = useCallback((accepted: File[], rejected: unknown[]) => {
    if (rejected && (rejected as unknown[]).length > 0) {
      toast.error("Please upload a PDF file under 5MB.");
      return;
    }
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  });

  const handleSubmit = async (values: UploadFormValues) => {
    if (!file) { toast.error("Please upload your CV first."); return; }
    setLoading(true);
    try {
      const report = await mutateAsync({ file, ...values });
      setReport(report, file.name);
      toast.success("Analysis complete!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={uploadSchema} onSubmit={handleSubmit}>
      {({ errors, touched }) => (
        <Form className="w-full min-w-0 max-h-screen">
          <div className="flex w-full min-w-0 flex-col gap-5 p-2 ">
            {/* Dropzone */}
            <div className="flex flex-col gap-1.5">
              <label className="label">Your CV (PDF only, max 5MB)</label>
              <div
                {...getRootProps()}
                className={[
                  "flex min-h-[140px] w-full max-w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-all duration-200 sm:px-6",
                  file
                    ? "border-[var(--success)] bg-[var(--success-light)]"
                    : isDragActive
                    ? "border-[var(--accent)] bg-[var(--accent-light)]"
                    : "border-[var(--border-strong)] bg-[var(--surface-2)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)]",
                ].join(" ")}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex w-full min-w-0 items-center gap-3">
                    <FileText size={24} className="shrink-0 text-[var(--success)]" />
                    <div className="min-w-0 flex-1 text-left">
                      <div className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {file.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {(file.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="shrink-0 rounded p-1 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full min-w-0 flex-col items-center gap-2 px-2">
                    <Upload size={28} className="text-[var(--accent)]" />
                    <p className="max-w-full text-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
                      {isDragActive ? "Drop it here!" : "Drag & drop your CV or click to browse"}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">PDF • Max 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="jobTitle" className="label">Target Job Title</label>
              <Field
                id="jobTitle"
                name="jobTitle"
                placeholder="e.g. Senior Frontend Engineer"
                className={`form-input ${errors.jobTitle && touched.jobTitle ? "form-input-error" : ""}`}
              />
              <ErrorMessage name="jobTitle">
                {(msg) => <span className="field-error">{msg}</span>}
              </ErrorMessage>
            </div>

            {/* Job Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="jobDescription" className="label">
                Job Description{" "}
                <span className="font-normal text-[var(--text-muted)]">
                  (paste the full JD for best results)
                </span>
              </label>
              <Field
                as="textarea"
                id="jobDescription"
                name="jobDescription"
                placeholder="Paste the full job description here..."
                rows={6}
                className={`form-input resize-y font-sans leading-relaxed ${
                  errors.jobDescription && touched.jobDescription ? "form-input-error" : ""
                }`}
              />
              <ErrorMessage name="jobDescription">
                {(msg) => <span className="field-error">{msg}</span>}
              </ErrorMessage>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full"
            >
              <Sparkles size={18} />
              Roast my CV
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
