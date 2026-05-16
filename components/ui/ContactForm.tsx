"use client";
import { useState, type FormEvent } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

interface ContactFormProps {
  accessKey?: string;
  brandName: string;
  whatsapp?: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  accessKey,
  brandName,
  whatsapp,
}: ContactFormProps) {
  const [state, setState] = useState<FormState>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!accessKey) {
      // Fallback to WhatsApp if Web3Forms key not set
      const form = e.currentTarget;
      const data = new FormData(form);
      const msg = `Halo ${brandName},\n\nNama: ${data.get(
        "name",
      )}\nEmail: ${data.get("email")}\nNomor: ${data.get(
        "phone",
      )}\n\nDetail kebutuhan:\n${data.get("message")}`;
      if (whatsapp) {
        window.open(whatsappUrl(whatsapp, msg), "_blank");
      }
      return;
    }

    setState("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", accessKey);
    data.append("subject", `${brandName} — Permintaan penawaran baru`);
    data.append("from_name", String(data.get("name") || "Form Web"));

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
        <Field label="Nama Lengkap" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Nomor WhatsApp" name="phone" type="tel" required />
      <Field
        label="Detail kebutuhan proyek"
        name="message"
        as="textarea"
        rows={5}
        required
        placeholder="Contoh: butuh sumur bor dalam ~120 m untuk pabrik di Cikarang…"
      />

      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-primary h-12 w-full px-6 text-sm sm:w-auto"
      >
        {state === "submitting" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : accessKey ? (
          <Send className="h-4 w-4" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
        )}
        {accessKey ? "Kirim Permintaan" : "Kirim via WhatsApp"}
      </button>

      {state === "success" && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <p>Terima kasih, pesan Anda telah terkirim.</p>
        </div>
      )}
      {state === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>Ada kendala. Coba lagi atau hubungi via WhatsApp.</p>
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
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="field-label">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className="field resize-y"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="field"
        />
      )}
    </label>
  );
}
