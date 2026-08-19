"use client";

import { useState, useTransition } from "react";
import { Spinner } from "@/components/Spinner";
import { getPostSummary } from "@/lib/ai/summarize";

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 2.5l1.8 5.2 5.2 1.8-5.2 1.8L12 16.5l-1.8-5.2-5.2-1.8 5.2-1.8L12 2.5Z" />
      <path d="M19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15Z" />
    </svg>
  );
}

export function AiSummaryButton({ postSlug }: { postSlug: string }) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    setOpen(true);
    if (summary !== null) return;
    startTransition(async () => {
      const result = await getPostSummary(postSlug.split("/"));
      setSummary(result);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label="AIによる要約を見る"
        title="AIによる要約を見る"
        className="fixed bottom-6 left-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:opacity-90"
      >
        <SparkleIcon />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AIによる要約"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-1.5 font-bold">
                <SparkleIcon />
                AIによる要約
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="閉じる"
                className="rounded-full p-1.5 hover:bg-foreground/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            {isPending || summary === null ? (
              <div className="flex items-center gap-3 py-4 text-sm text-foreground/60">
                <Spinner size={20} />
                要約を生成しています…
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{summary}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
