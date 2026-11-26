"use client";

// Formulario de contacto con validación en el cliente (el servidor vuelve a validar).

import { useEffect, useRef, useState } from "react";
import { CircleAlert, LoaderCircle, RotateCcw, Send } from "lucide-react";
import {
  contactSchema,
  fieldErrorsFrom,
  type ContactField,
  type ContactInput,
  type ContactResponse,
} from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/t";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string; notConfigured?: boolean };

const empty: ContactInput = { name: "", email: "", message: "" };

const fields: { id: ContactField; label: string; type: "text" | "email" | "textarea"; autoComplete: string }[] = [
  { id: "name", label: "Name", type: "text", autoComplete: "name" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  { id: "message", label: "Message", type: "textarea", autoComplete: "off" },
];

export function ContactForm() {
  const t = useT();
  const [values, setValues] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedAt = useRef<number>(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function validate(next: ContactInput) {
    const result = contactSchema.safeParse(next);
    return result.success ? {} : fieldErrorsFrom(result.error);
  }

  function update(field: ContactField, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
    if (status.kind === "error" || status.kind === "success") setStatus({ kind: "idle" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // evita envíos duplicados (doble clic o Enter repetido)
    if (inFlight.current) return;
    const found = validate(values);
    setTouched({ name: true, email: true, message: true });
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    inFlight.current = true;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        signal: AbortSignal.timeout(15_000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          company: honeypot.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json()) as ContactResponse;
      if (res.ok && data.ok) {
        setStatus({ kind: "success", message: data.message });
        setValues(empty);
        setTouched({});
        return;
      }
      if (data.ok) throw new Error("Unexpected contact response");
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setStatus({ kind: "error", message: data.message, notConfigured: data.code === "EMAIL_NOT_CONFIGURED" });
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "TimeoutError";
      setStatus({ kind: "error", message: timedOut
        ? "Delivery confirmation timed out. The message may have been sent; you can also contact me by email."
        : "Couldn't reach the server. Check your connection and try again." });
    } finally {
      inFlight.current = false;
    }
  }

  const sending = status.kind === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="relative" aria-describedby="contact-status">
      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input ref={honeypot} id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-8">
        {fields.map((f) => {
          const error = touched[f.id] ? errors[f.id] : undefined;
          const common = {
            id: `contact-${f.id}`,
            name: f.id,
            value: values[f.id],
            autoComplete: f.autoComplete,
            disabled: sending,
            required: true,
            maxLength: f.id === "name" ? 80 : f.id === "email" ? 160 : 2000,
            "aria-invalid": Boolean(error),
            "aria-describedby": error ? `contact-${f.id}-error` : undefined,
            onBlur: () => {
              setTouched((t) => ({ ...t, [f.id]: true }));
              setErrors(validate(values));
            },
            className: cn(
              "w-full border-0 border-b bg-transparent px-0 pb-3 pt-2 text-lg text-fg outline-none transition-colors placeholder:text-muted/50 focus:border-accent disabled:opacity-60",
              error ? "border-[#ff8a7a]" : "border-line",
            ),
          };
          return (
            <div key={f.id}>
              <label htmlFor={`contact-${f.id}`} className="type-label flex justify-between">
                <span>{t(f.label).toUpperCase()}</span>
                {f.id === "message" && <span>{values.message.length} / 2000</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  {...common}
                  rows={5}
                  maxLength={2000}
                  onChange={(e) => update(f.id, e.target.value)}
                  className={cn(common.className, "resize-y")}
                />
              ) : (
                <input {...common} type={f.type} onChange={(e) => update(f.id, e.target.value)} />
              )}
              {error && (
                <p id={`contact-${f.id}-error`} className="mt-2 text-[13px] text-[#ff8a7a]">
                  {t(error)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Botón con estados: Send message → Sending... → Sent (solo tras éxito real) / Try again.
            Las etiquetas se apilan en la misma celda: el botón no cambia de tamaño. */}
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          data-state={status.kind}
          className={cn(
            "group inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-fg px-6 text-sm font-medium text-bg transition-[background-color,color,transform] duration-200 active:scale-[0.97] disabled:cursor-wait",
            status.kind !== "success" && "hover:bg-accent hover:text-ink",
          )}
        >
          <span className="grid">
            <ButtonLabel on={status.kind === "idle"}>
              {t("Send message")}
              <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </ButtonLabel>
            <ButtonLabel on={sending}>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              {t("Sending...")}
            </ButtonLabel>
            <ButtonLabel on={status.kind === "success"} className="text-[var(--paper-signal)]">
              <DrawCheck on={status.kind === "success"} />
              {t("Sent")}
            </ButtonLabel>
            <ButtonLabel on={status.kind === "error"}>
              <RotateCcw className="size-4" aria-hidden="true" />
              {t("Try again")}
            </ButtonLabel>
          </span>
        </button>

        <div id="contact-status" role="status" aria-live="polite" className="min-h-6 text-[14px]">
          {status.kind === "success" && (
            <p className="inline-flex items-center gap-2 text-accent">
              {t(status.message)}
            </p>
          )}
          {status.kind === "error" && (
            <p className={cn("inline-flex items-start gap-2", status.notConfigured ? "text-muted" : "text-[#ff8a7a]")}>
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{t(status.message)}</span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

// Etiqueta del botón: entra y sale con opacidad, desenfoque de 2px y un pequeño desplazamiento.
function ButtonLabel({ on, className, children }: { on: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span
      aria-hidden={!on}
      className={cn(
        "col-start-1 row-start-1 inline-flex items-center justify-center gap-3 transition-[opacity,filter,transform] duration-300 ease-out",
        on ? "translate-y-0 opacity-100 blur-0" : "pointer-events-none translate-y-1.5 opacity-0 blur-[2px]",
        className,
      )}
    >
      {children}
    </span>
  );
}

// Check que se dibuja con el trazo del SVG (en el tono legible del verde lima sobre fondo claro).
function DrawCheck({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M4.5 12.5l5 5 10-11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: on ? 0 : 1,
          transition: on ? "stroke-dashoffset 380ms cubic-bezier(0.65,0,0.35,1) 120ms" : "none",
        }}
      />
    </svg>
  );
}
