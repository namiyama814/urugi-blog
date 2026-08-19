"use server";

import { parse } from "node-html-parser";
import { getSummaryRuntime } from "@/lib/cloudflare";
import { getPost } from "@/lib/scraper/post";
import type { PostDetail, PostSlug } from "@/lib/scraper/types";

// Smaller instruct models (1b/3b) don't reliably follow the "1-2 sentences"
// instruction in Japanese — rambling, occasionally incoherent output. At this
// app's volume (one generation per post, ever, then cached) even a 70b model
// costs a fraction of a cent, so quality wins over shaving Neuron usage.
const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const MAX_INPUT_CHARS = 3000;
const FALLBACK_MESSAGE = "要約を生成できませんでした。しばらくしてからもう一度お試しください。";

/** Concatenates block-level text (not raw textContent) so paragraphs/list items
 * don't run together into one unreadable line for the model to summarize. */
function extractPlainText(html: string): string {
  const root = parse(html);
  const blocks = root.querySelectorAll("p, li, blockquote, h3, h4");
  const nodes = blocks.length > 0 ? blocks : [root];
  return nodes
    .map((el) => el.textContent.trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, MAX_INPUT_CHARS);
}

async function generateSummary(
  runtime: NonNullable<Awaited<ReturnType<typeof getSummaryRuntime>>>,
  post: PostDetail,
): Promise<string | undefined> {
  const text = extractPlainText(post.contentHtml);
  if (!text) return undefined;

  const result = await runtime.ai.run(MODEL, {
    messages: [
      {
        role: "system",
        content:
          "あなたはブログ記事の内容を日本語で簡潔に要約するアシスタントです。前置きなしで、1〜2文の要約だけを出力してください。",
      },
      { role: "user", content: `次のブログ記事を1〜2文で要約してください:\n\n${text}` },
    ],
    max_tokens: 150,
    temperature: 0.3,
  });

  const summary = (result as { response?: string }).response?.trim();
  if (!summary) return undefined;

  await runtime.db
    .prepare(
      "INSERT INTO post_summaries (slug, summary, created_at) VALUES (?, ?, ?) ON CONFLICT(slug) DO NOTHING",
    )
    .bind(post.slug.join("/"), summary, new Date().toISOString())
    .run();

  return summary;
}

/**
 * Server Action backing the post page's "AI要約" popup — called on demand
 * when the reader opens it, not automatically on every page view, so
 * summaries are only ever generated for posts someone actually asked about.
 * Returns the cached summary if one exists, otherwise generates and caches one.
 */
export async function getPostSummary(slug: PostSlug): Promise<string> {
  const joined = slug.join("/");

  const runtime = await getSummaryRuntime();
  if (!runtime) return FALLBACK_MESSAGE;

  const cached = await runtime.db
    .prepare("SELECT summary FROM post_summaries WHERE slug = ?")
    .bind(joined)
    .first<{ summary: string }>();
  if (cached) return cached.summary;

  try {
    const post = await getPost(slug);
    const summary = await generateSummary(runtime, post);
    return summary ?? FALLBACK_MESSAGE;
  } catch (err) {
    console.error("[ai] summary generation failed", err);
    return FALLBACK_MESSAGE;
  }
}
