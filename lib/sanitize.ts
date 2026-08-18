import { type Node, NodeType, parse } from "node-html-parser";

const ALLOWED_TAGS = new Set([
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
]);

/** Tags removed entirely (including their content), not just unwrapped. */
const DISCARD_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "noscript",
  "form",
  "template",
  "svg",
  "math",
  "link",
  "meta",
  "head",
  "base",
]);

const VOID_TAGS = new Set(["br", "img"]);

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "title"],
  img: ["src", "srcset", "sizes", "alt", "title", "width", "height"],
};
const GLOBAL_ALLOWED_ATTRIBUTES = ["class"];

function escapeText(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function buildAttributes(tag: string, attributes: Record<string, string>): string {
  const allowed = new Set([...(ALLOWED_ATTRIBUTES[tag] ?? []), ...GLOBAL_ALLOWED_ATTRIBUTES]);
  const parts: string[] = [];

  for (const [name, value] of Object.entries(attributes)) {
    if (!allowed.has(name)) continue;
    parts.push(`${name}="${escapeAttr(value)}"`);
  }

  // Source site's inline sizing is tuned to its own narrow column; we size images ourselves.
  if (tag === "img") {
    parts.push('loading="lazy"', 'decoding="async"', 'referrerpolicy="no-referrer"');
  }
  if (tag === "a") {
    parts.push('target="_blank"', 'rel="noopener noreferrer nofollow"');
  }

  return parts.length > 0 ? ` ${parts.join(" ")}` : "";
}

function walk(node: Node, out: string[]): void {
  for (const child of node.childNodes) {
    if (child.nodeType === NodeType.TEXT_NODE) {
      out.push(escapeText(child.text));
      continue;
    }
    if (child.nodeType !== NodeType.ELEMENT_NODE) continue;

    const el = child as import("node-html-parser").HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (DISCARD_TAGS.has(tag)) continue;

    if (!ALLOWED_TAGS.has(tag)) {
      // Unwrap: drop the tag itself but keep sanitizing its children.
      walk(el, out);
      continue;
    }

    out.push(`<${tag}${buildAttributes(tag, el.attributes)}>`);
    if (!VOID_TAGS.has(tag)) {
      walk(el, out);
      out.push(`</${tag}>`);
    }
  }
}

/**
 * Sanitizes scraped third-party HTML before it's rendered via dangerouslySetInnerHTML.
 * Rebuilds the markup from an explicit tag/attribute allowlist rather than mutating
 * the parsed tree — `style` and event-handler attributes are never in the allowlist,
 * so they're dropped by construction. Uses `node-html-parser` (not cheerio/jsdom-based
 * tools) since it has no Node/DOM dependency and keeps the Cloudflare Workers bundle small.
 */
export function sanitizePostHtml(raw: string): string {
  const root = parse(raw);
  const out: string[] = [];
  walk(root, out);
  return out.join("");
}
