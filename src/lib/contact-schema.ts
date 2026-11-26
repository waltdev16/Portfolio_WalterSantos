// Esquema Zod del formulario de contacto, compartido entre el cliente y el servidor.

import { z } from "zod";

/**
 * Shared by the form (client) and the route handler (server),
 * so both sides apply exactly the same rules.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters).")
    .max(80, "Name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .max(160, "Email must be 160 characters or fewer.")
    .pipe(z.email("Enter a valid email address, like name@domain.com.")),
  message: z
    .string()
    .trim()
    .min(10, "Write a message of at least 10 characters.")
    .max(2000, "Message must be 2000 characters or fewer."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Anti-spam fields sent alongside the form, validated only on the server. */
export const antiSpamSchema = z.object({
  /** Honeypot: hidden input that real users never fill. */
  company: z.string().optional(),
  /** Timestamp (ms) when the form was rendered. */
  startedAt: z.number().optional(),
});

export type ContactResponse =
  | { ok: true; message: string }
  | {
      ok: false;
      code: "VALIDATION_ERROR" | "RATE_LIMITED" | "EMAIL_NOT_CONFIGURED" | "DELIVERY_FAILED" | "BAD_REQUEST";
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
    };

export function fieldErrorsFrom(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
