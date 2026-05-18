import { asString } from "@/lib/normalize";

/**
 * Renders simple markdown-like blocks (paragraphs, headings, lists, quotes).
 */
export function ContentRenderer({ text }: { text: unknown }) {
  const content = asString(text).trim();
  if (!content) return null;

  return (
    <>
      {content.split(/\n\s*\n/).map((para, i) => {
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
