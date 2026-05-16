"use client";
import { whatsappUrl } from "@/lib/utils";

export function FloatingWhatsApp({
  whatsapp,
  brandName,
  label = "Chat WhatsApp",
}: {
  whatsapp: string;
  brandName: string;
  label?: string;
}) {
  if (!whatsapp) return null;
  return (
    <a
      href={whatsappUrl(
        whatsapp,
        `Halo, saya tertarik dengan layanan ${brandName}.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_32px_-8px_rgb(37_211_102/0.7)] transition-all duration-300 hover:scale-105 hover:bg-[#1ebe5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-60 animate-pulse-brand"
      />
      <svg
        viewBox="0 0 32 32"
        className="relative h-6 w-6 transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
        fill="currentColor"
      >
        <path d="M16.003 3C9.378 3 4 8.378 4 15c0 2.475.756 4.78 2.058 6.703L4 29l7.482-2.018A11.93 11.93 0 0016.003 27C22.628 27 28 21.622 28 15S22.628 3 16.003 3zm0 21.65a9.61 9.61 0 01-5.06-1.444l-.363-.226-4.444 1.196 1.187-4.31-.236-.376A9.65 9.65 0 1116.003 24.65zm5.526-7.245c-.302-.151-1.79-.882-2.066-.983-.277-.1-.479-.151-.682.151-.202.302-.781.983-.957 1.184-.176.202-.353.226-.655.075-.302-.151-1.275-.47-2.43-1.5-.898-.8-1.504-1.787-1.68-2.09-.176-.302-.019-.466.132-.617.135-.135.302-.353.453-.53.151-.176.202-.302.302-.504.1-.202.05-.378-.025-.53-.075-.151-.682-1.643-.934-2.25-.246-.59-.497-.51-.682-.52-.176-.008-.378-.01-.58-.01-.202 0-.53.075-.807.378-.277.302-1.06 1.034-1.06 2.524s1.085 2.93 1.236 3.131c.151.202 2.135 3.26 5.176 4.575 1.864.81 2.594.872 3.5.747.557-.082 1.79-.731 2.043-1.437.252-.706.252-1.31.176-1.437-.075-.126-.277-.202-.58-.353z" />
      </svg>
    </a>
  );
}
