import * as cheerio from "cheerio";
import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "a",
  "ul",
  "ol",
  "li",
  "h3",
  "h4",
  "blockquote",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "span",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "title"],
  img: ["src", "srcset", "sizes", "alt", "title", "width", "height"],
  "*": ["class"],
};

/**
 * Sanitizes scraped third-party HTML before it's rendered via dangerouslySetInnerHTML.
 * `style` and event-handler attributes are deliberately excluded from the allowlist.
 * Uses `sanitize-html` (not jsdom-based sanitizers) since it has no Node/DOM
 * dependency and runs reliably on the Cloudflare Workers runtime.
 */
export function sanitizePostHtml(raw: string): string {
  const clean = sanitizeHtml(raw, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  });

  const $ = cheerio.load(clean, null, false);

  // Source site's inline width/height styling is tuned to its own narrow column;
  // strip it and let our own CSS size images instead.
  $("img").each((_, el) => {
    const $el = $(el);
    $el.removeAttr("style");
    $el.attr("loading", "lazy");
    $el.attr("decoding", "async");
    $el.attr("referrerpolicy", "no-referrer");
  });

  $("a").each((_, el) => {
    const $el = $(el);
    $el.attr("target", "_blank");
    $el.attr("rel", "noopener noreferrer nofollow");
  });

  return $.html();
}
