"use client";

import Link from "next/link";
import { useState } from "react";
import { FeedScroller } from "@/components/FeedScroller";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { useImageBookmarks } from "@/contexts/ImageBookmarksContext";
import { formatSourceDate } from "@/lib/formatDate";

type Tab = "posts" | "images";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const { imageBookmarks } = useImageBookmarks();
  const [tab, setTab] = useState<Tab>("posts");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">ブックマーク</h1>

      <div className="mb-6 flex gap-1 border-b border-foreground/10">
        <button
          type="button"
          onClick={() => setTab("posts")}
          aria-current={tab === "posts"}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "posts"
              ? "border-b-2 border-foreground text-foreground"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
        >
          記事
        </button>
        <button
          type="button"
          onClick={() => setTab("images")}
          aria-current={tab === "images"}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "images"
              ? "border-b-2 border-foreground text-foreground"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
        >
          画像
        </button>
      </div>

      {tab === "posts" &&
        (bookmarks.length === 0 ? (
          <p className="text-foreground/60">ブックマークした記事はありません。</p>
        ) : (
          <ul className="divide-y divide-foreground/10 overflow-hidden rounded-2xl border border-foreground/10">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.slug}
                className="relative px-4 py-4 transition-colors hover:bg-foreground/5"
              >
                <Link
                  href={`/post/${bookmark.slug}`}
                  className="font-medium after:absolute after:inset-0"
                >
                  {bookmark.title}
                </Link>
                <p className="mt-1 text-sm text-foreground/60">
                  {formatSourceDate(bookmark.date)}
                </p>
              </li>
            ))}
          </ul>
        ))}

      {tab === "images" &&
        (imageBookmarks.length === 0 ? (
          <p className="text-foreground/60">ブックマークした画像はありません。</p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {imageBookmarks.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setOpenIndex(index)}
                title={image.postTitle}
                className="aspect-square overflow-hidden rounded-md bg-foreground/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        ))}

      {openIndex !== null && (
        <div className="feed-backdrop fixed inset-0 z-50">
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="閉じる"
            className="absolute left-3 top-10 z-30 rounded-full p-2 text-white hover:bg-white/10"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <FeedScroller
            images={imageBookmarks}
            initialIndex={openIndex}
            endLabel="閉じる"
            onEnd={() => setOpenIndex(null)}
          />
        </div>
      )}
    </div>
  );
}
