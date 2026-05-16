import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      colors: {
        // ── Brand: light-blue (sky) accent ───────────
        brand: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9", // primary accent
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
          950: "#082F49",
        },
        // ── Neutral premium light palette ────────────
        ink: {
          DEFAULT: "#0F172A", // slate-900
          soft: "#1E293B", // slate-800
          muted: "#475569", // slate-600
          subtle: "#64748B", // slate-500
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F8FAFC", // slate-50
          line: "#E2E8F0", // slate-200
          mute: "#F1F5F9", // slate-100
        },
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.045) 1px, transparent 1px)",
        "dots-light":
          "radial-gradient(rgba(15,23,42,0.08) 1px, transparent 1px)",
        "brand-soft":
          "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #FFFFFF 100%)",
        "hero-mesh":
          "radial-gradient(at 18% 22%, rgba(186,230,253,0.55) 0px, transparent 50%), radial-gradient(at 82% 0%, rgba(125,211,252,0.4) 0px, transparent 45%), radial-gradient(at 60% 100%, rgba(224,242,254,0.6) 0px, transparent 50%)",
        "brand-gradient":
          "linear-gradient(135deg, #38BDF8 0%, #0EA5E9 50%, #0369A1 100%)",
        "shimmer-light":
          "linear-gradient(110deg, transparent 0%, rgba(14,165,233,0.08) 50%, transparent 100%)",
      },
      backgroundSize: {
        "grid-32": "32px 32px",
        "dots-22": "22px 22px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "104": "26rem",
        "128": "32rem",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-left": "slideLeft 0.7s ease forwards",
        "slide-right": "slideRight 0.7s ease forwards",
        "scale-in": "scaleIn 0.5s ease forwards",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 35s linear infinite",
        float: "float 7s ease-in-out infinite",
        "pulse-brand": "pulseBrand 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(28px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-28px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-22px)" },
        },
        pulseBrand: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(14,165,233,0.4)" },
          "50%": { boxShadow: "0 0 0 18px rgba(14,165,233,0)" },
        },
      },
      boxShadow: {
        "soft-xs": "0 1px 2px rgba(15,23,42,0.05)",
        "soft-sm":
          "0 2px 6px -1px rgba(15,23,42,0.06), 0 1px 3px -1px rgba(15,23,42,0.04)",
        soft: "0 8px 28px -8px rgba(15,23,42,0.10), 0 3px 8px -2px rgba(15,23,42,0.04)",
        "soft-lg":
          "0 22px 50px -12px rgba(15,23,42,0.15), 0 8px 20px -4px rgba(15,23,42,0.05)",
        "brand-glow":
          "0 10px 30px -10px rgba(14,165,233,0.55), 0 4px 12px -4px rgba(14,165,233,0.25)",
        "brand-glow-lg":
          "0 18px 48px -12px rgba(14,165,233,0.55), 0 8px 18px -4px rgba(14,165,233,0.25)",
        "inner-brand": "inset 0 1px 0 rgba(14,165,233,0.2)",
      },
      backdropBlur: { xs: "2px" },
      screens: { "3xl": "1920px" },
      gridTemplateColumns: {
        portfolio: "repeat(auto-fill, minmax(320px, 1fr))",
        services: "repeat(auto-fill, minmax(280px, 1fr))",
      },
    },
  },
  plugins: [],
};

export default config;
