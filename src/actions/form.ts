"use server";

import { formSchema, FormSchema } from "../lib/schema";
import prisma from "../server/db/prisma";
import { notifyPabbly } from "../lib/utils";
import { FormData } from "../types";

export async function submitForm(formData: FormData) {
  try {
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      };
    }

    const submission = await prisma.submission.create({
      data: {
        email: result.data.email,
        agreed: result.data.agreed,
      },
    });

    await notifyPabbly(submission.id);
    return {
      success: true,
      message: "Form submitted",
      data: { submissionId: submission.id },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
