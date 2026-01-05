import * as Yup from "yup";

export const uploadSchema = Yup.object({
  jobTitle: Yup.string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title is too long")
    .required("Job title is required"),
  jobDescription: Yup.string()
    .min(50, "Please provide at least 50 characters for a better analysis")
    .max(5000, "Job description is too long")
    .required("Job description is required"),
});
