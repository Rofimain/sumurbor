import { asString } from "@/lib/normalize";

const IMAGE_MD = /^!\[([^\]]*)\]\(([^)]+)\)$/;

/**
 * Renders simple markdown-like blocks (paragraphs, headings, lists, quotes, images).
 */
export function ContentRenderer({ text }: { text: unknown }) {
  const content = asString(text).trim();
  if (!content) return null;

  return (
    <>
      {content.split(/\n\s*\n/).map((para, i) => {
        const imageMatch = para.trim().match(IMAGE_MD);
        if (imageMatch) {
          const [, alt, src] = imageMatch;
          return (
            <figure key={i} className="not-prose my-8">
              <img
                src={src.trim()}
                alt={alt.trim() || "Gambar ilustrasi"}
                className="w-full rounded-2xl object-cover shadow-soft-md"
                loading="lazy"
              />
              {alt.trim() && (
                <figcaption className="mt-2 text-center text-sm text-ink-subtle">
                  {alt.trim()}
                </figcaption>
              )}
            </figure>
          );
        }
        if (para.startsWith("## ")) {
          return <h2 key={i}>{para.replace(/^##\s*/, "")}</h2>;
        }
        if (para.startsWith("### ")) {
          return <h3 key={i}>{para.replace(/^###\s*/, "")}</h3>;
        }
        if (para.startsWith("#### ")) {
          return <h4 key={i}>{para.replace(/^####\s*/, "")}</h4>;
        }
        if (para.startsWith("- ")) {
          return (
            <ul key={i}>
              {para.split("\n").map((li, j) => (
                <li key={j}>{li.replace(/^-\s*/, "")}</li>
              ))}
            </ul>
          );
        }
        if (/^\d+\.\s/.test(para)) {
          return (
            <ol key={i}>
              {para.split("\n").map((li, j) => (
                <li key={j}>{li.replace(/^\d+\.\s*/, "")}</li>
              ))}
            </ol>
          );
        }
        if (para.startsWith("> ")) {
          return (
            <blockquote key={i}>{para.replace(/^>\s*/, "")}</blockquote>
          );
        }
        return <p key={i}>{para}</p>;
      })}
    </>
  );
}
