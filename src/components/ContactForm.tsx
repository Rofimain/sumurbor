"use client";
import { useState, type FormEvent } from "react";
import { Send, Loader2 } from "lucide-react";
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
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} />
      <div className="grid gap-4 sm:grid-cols-2">
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
        className="btn-primary w-full sm:w-auto"
      >
        {state === "submitting" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {dict.contact.formSubmit}
      </button>

      {state === "success" && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {dict.contact.formSuccess}
        </p>
      )}
      {state === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {dict.contact.formError}
        </p>
      )}
      {!accessKey && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
          Set <code>NEXT_PUBLIC_WEB3FORMS_KEY</code> di environment variable
          Cloudflare Pages untuk mengaktifkan form.
        </p>
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
    "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {as === "textarea" ? (
        <textarea name={name} required={required} rows={rows} className={inputClass} />
      ) : (
        <input name={name} type={type} required={required} className={inputClass} />
      )}
    </label>
  );
}
