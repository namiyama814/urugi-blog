import { parse } from "node-html-parser";
import type { PostImage } from "./types";

/**
 * Server-side counterpart to PostContent.tsx's client-side image collection
 * (container.querySelectorAll("img") + img.closest("figure")?.querySelector("figcaption")).
 * Walks already-sanitized contentHtml (see ../sanitize.ts) with node-html-parser instead
 * of the browser DOM, so routes that only need the image list (the /feed viewer) can stay
 * Server Components. Does not touch PostContent.tsx/ImageReel.tsx's own click-to-open wiring.
 */
export function extractPostImages(contentHtml: string): PostImage[] {
  const root = parse(contentHtml);

  return root
    .querySelectorAll("img")
    .map((img) => {
      const caption = img.closest("figure")?.querySelector("figcaption")?.textContent.trim();
      return {
        src: img.getAttribute("src") ?? "",
        alt: img.getAttribute("alt") ?? "",
        caption: caption || undefined,
      };
    })
    .filter((image) => image.src !== "");
}
