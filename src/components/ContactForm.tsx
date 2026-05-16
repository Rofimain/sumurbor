"use client";
import { useState, type FormEvent } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { Dictionary } from "@/i18n/getDictionary";

interface ContactFormProps {
  dict: Dictionary;
  accessKey?: string;
  brandName: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm({ dict, accessKey, brandName }: ContactFormProps) {
  const [state, setState] = useState<FormState>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!accessKey) {
      setState("error");
      return;
    }
    data.append("access_key", accessKey);
    data.append("subject", `${brandName} — New inquiry`);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setState("success");
        form.reset();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.contact.formName} name="name" required />
        <Field label={dict.contact.formEmail} name="email" type="email" required />
      </div>
      <Field label={dict.contact.formPhone} name="phone" type="tel" required />
      <Field
        label={dict.contact.formMessage}
        name="message"
        as="textarea"
        rows={5}
        required
      />

      <button
        type="submit"
        disabled={state === "submitting" || !accessKey}
        className="btn-primary h-12 w-full px-6 text-sm sm:w-auto"
      >
        {state === "submitting" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {dict.contact.formSubmit}
      </button>

      {state === "success" && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{dict.contact.formSuccess}</p>
        </div>
      )}
      {state === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{dict.contact.formError}</p>
        </div>
      )}
      {!accessKey && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Set <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">NEXT_PUBLIC_WEB3FORMS_KEY</code> di
            environment variable Cloudflare Pages untuk mengaktifkan form.
          </p>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  as,
  rows,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const inputClass =
    "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-soft-sm placeholder:text-slate-400 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";
  return (
    <label className="block text-sm">
      <span className="mb-2 block font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input name={name} type={type} required={required} className={inputClass} />
      )}
    </label>
  );
}
