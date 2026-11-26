// Endpoint POST /api/contact: valida el formulario de contacto en el servidor y envía el correo (Resend).

import { NextResponse } from "next/server";
import {
  antiSpamSchema,
  contactSchema,
  fieldErrorsFrom,
  type ContactResponse,
} from "@/lib/contact-schema";
import { isEmailConfigured, sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const MIN_FILL_MS = 2500; // envíos más rápidos que esto se tratan como bots
const MAX_BODY_BYTES = 16 * 1024; // el formulario completo ocupa mucho menos

function json(body: ContactResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

export async function POST(request: Request) {
  // 1. Lectura del cuerpo (con tamaño máximo)
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return json({ ok: false, code: "BAD_REQUEST", message: "The message is too large." }, 413);
  }
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return json({ ok: false, code: "BAD_REQUEST", message: "The message is too large." }, 413);
    }
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, code: "BAD_REQUEST", message: "The request body must be valid JSON." }, 400);
  }
  if (typeof raw !== "object" || raw === null) {
    return json({ ok: false, code: "BAD_REQUEST", message: "The request body must be a JSON object." }, 400);
  }

  // 2. Protección de spam. Un rechazo nunca se presenta como entrega confirmada.
  const spam = antiSpamSchema.safeParse(raw);
  const startedAt = spam.success ? spam.data.startedAt : undefined;
  const looksAutomated =
    !spam.success ||
    Boolean(spam.data.company) ||
    (typeof startedAt === "number" && Date.now() - startedAt < MIN_FILL_MS);
  if (looksAutomated) {
    return json({ ok: false, code: "BAD_REQUEST", message: "Message not sent. Wait a moment and try again, or use the email link." }, 400);
  }

  // 3. Rate limit by client IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return json(
      { ok: false, code: "RATE_LIMITED", message: "Too many messages from this connection. Try again in a few minutes." },
      429,
      { "Retry-After": String(limit.retryAfter ?? 600) },
    );
  }

  // 4. Validate fields (same schema as the client)
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Some fields need attention.",
        fieldErrors: fieldErrorsFrom(parsed.error),
      },
      422,
    );
  }

  // 5. Deliver — or say clearly that delivery is not set up yet
  if (!isEmailConfigured()) {
    return json(
      {
        ok: false,
        code: "EMAIL_NOT_CONFIGURED",
        message: "Your message is valid, but email delivery isn't switched on yet, so it was not sent.",
      },
      503,
    );
  }

  try {
    const result = await sendContactEmail(parsed.data);
    if (!result.ok) {
      return json(
        { ok: false, code: "DELIVERY_FAILED", message: "The message couldn't be delivered. Try again later." },
        502,
      );
    }
  } catch (error) {
    console.error("[contact] delivery error:", error instanceof Error ? error.name : "unknown");
    return json(
      { ok: false, code: "DELIVERY_FAILED", message: "The message couldn't be delivered. Try again later." },
      502,
    );
  }

  return json({ ok: true, message: "Message sent. Thanks for writing." }, 200);
}
// Other methods (GET, PUT…) get an automatic 405 from Next.js.
