// Envío del correo de contacto con la API de Resend (usa variables de entorno).

import "server-only";
import type { ContactInput } from "./contact-schema";

/**
 * Email delivery through Resend's REST API (no SDK needed).
 * Delivery is only active when RESEND_API_KEY and CONTACT_TO_EMAIL exist.
 * Without them the API answers 503 EMAIL_NOT_CONFIGURED — it never
 * pretends a message was sent.
 */

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContactEmail(input: ContactInput): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "walt.dev <onboarding@resend.dev>";
  if (!apiKey || !to) return { ok: false, error: "not-configured" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      // el nombre va en el asunto sin saltos de línea
      subject: `walt.dev — New message from ${input.name.replace(/[\r\n]+/g, " ")}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
      html: `<div style="margin:0;padding:24px 12px;background:#f1f2f4;font-family:Arial,sans-serif;color:#171717">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #dedede;border-collapse:separate;border-radius:8px;overflow:hidden">
<tr><td style="background:#111111;padding:28px;color:#fff">
<div style="font-size:24px;font-weight:bold"><span style="color:#c3f34b;font-family:monospace">&gt;_</span> walt.dev</div>
<div style="border-top:1px solid #444;margin:22px 0"></div>
<div style="color:#c3f34b;font-size:11px;letter-spacing:2px">INCOMING MESSAGE</div>
<h1 style="font-size:26px;line-height:1.25;margin:12px 0">You've got a new message.</h1>
<p style="color:#ccc;font-size:14px;line-height:1.5;margin:0">Someone reached out through your personal portfolio.</p>
</td></tr>
<tr><td style="padding:28px;overflow-wrap:anywhere;word-break:break-word">
<div style="font-size:11px;letter-spacing:1px;color:#626262">FROM</div>
<p style="font-size:20px;font-weight:bold;margin:8px 0">${escape(input.name)}</p>
<p style="font-size:14px;margin:0 0 22px;color:#555">${escape(input.email)}</p>
<div style="border-top:1px solid #ddd;padding-top:20px;font-size:11px;letter-spacing:1px;color:#626262">MESSAGE</div>
<p style="font-size:15px;line-height:1.7;margin:12px 0 24px">${escape(input.message).replace(/\r\n|\r|\n/g, "<br>")}</p>
<a href="mailto:${escape(encodeURIComponent(input.email))}" style="display:inline-block;background:#c3f34b;color:#111111;padding:13px 22px;border-radius:4px;text-decoration:none;font-size:14px;font-weight:bold">Reply to sender &nbsp; &#8599;</a>
</td></tr>
<tr><td style="border-top:1px solid #ddd;padding:20px 28px;text-align:center;color:#626262;font-size:12px;line-height:1.6">Sent via walt.dev &middot; Portfolio Contact System<br>Designed &amp; developed by Walter Santos.</td></tr>
</table></div>`,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    // Log status only; never log the API key or the request body.
    console.error("[contact] Resend responded with", res.status);
    return { ok: false, error: `provider-${res.status}` };
  }
  return { ok: true };
}
