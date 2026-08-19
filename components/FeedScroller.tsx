"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ImageBookmarkButton } from "@/components/ImageBookmarkButton";
import type { PostImage } from "@/lib/scraper/types";

/** A photo plus the post it belongs to — each slide bookmarks independently,
 * so unlike a single-article feed, a bookmarks-tab feed can mix posts. */
export interface FeedImage extends PostImage {
  postSlug: string;
  postTitle: string;
}

interface FeedScrollerProps {
  images: FeedImage[];
  /** Which slide to open on, e.g. the thumbnail that was tapped. Defaults to the first. */
  initialIndex?: number;
  /** Label for the trailing "that's all" slide's action. */
  endLabel: string;
  /** Renders the trailing action as a link (route navigation, e.g. back to the article). */
  endHref?: string;
  /** Renders the trailing action as a button (in-place dismissal, e.g. closing a modal). */
  onEnd?: () => void;
}

export function FeedScroller({
  images,
  initialIndex = 0,
  endLabel,
  endHref,
  onEnd,
}: FeedScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const dotLayerRef = useRef<HTMLDivElement>(null);
  const viewedRef = useRef<Set<number>>(new Set());
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Jumps straight to the requested slide before paint, so opening from e.g. a
  // bookmarks grid lands on the tapped photo instead of always the first one.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const slide = slideRefs.current[initialIndex];
    if (!container || !slide || initialIndex === 0) return;
    container.scrollTop = slide.offsetTop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const index = slideRefs.current.indexOf(mostVisible.target as HTMLDivElement);
        if (index !== -1) setActiveIndex(index);
      },
      { root: container, threshold: 0.6 },
    );

    for (const slide of slideRefs.current) {
      if (slide) observer.observe(slide);
    }
    return () => observer.disconnect();
  }, [images.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length <= 1) return;
    const onScroll = () => setHasScrolled(true);
    container.addEventListener("scroll", onScroll, { once: true, passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [images.length]);

  // Rubber-band pulse: while scrolling between two slides, both bulge slightly and
  // settle back to their normal size once snapped. Written directly to the DOM (not
  // React state) since it needs to update every scroll frame without re-rendering.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length === 0) return;

    let rafId: number | null = null;
    const applyRubberBand = () => {
      rafId = null;
      const height = container.clientHeight;
      if (height === 0) return;
      const progress = container.scrollTop / height;
      const lower = Math.floor(progress);
      const scale = 1 + Math.sin((progress - lower) * Math.PI) * 0.06;

      imgRefs.current.forEach((img, i) => {
        if (!img) return;
        img.style.transform = i === lower || i === lower + 1 ? `scale(${scale})` : "";
      });
    };
    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(applyRubberBand);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [images.length]);

  // Focus-in pop whenever a slide becomes active (every visit, not just the first),
  // plus a one-off "exp dot" flourish the first time each photo is seen this session.
  useEffect(() => {
    const img = imgRefs.current[activeIndex];
    img?.animate(
      [
        { filter: "blur(8px) brightness(1.3)", transform: "scale(0.96)" },
        { filter: "blur(0px) brightness(1)", transform: "scale(1)" },
      ],
      { duration: 350, easing: "ease-out" },
    );

    if (viewedRef.current.has(activeIndex)) return;
    viewedRef.current.add(activeIndex);

    const layer = dotLayerRef.current;
    if (!layer) return;
    const dot = document.createElement("div");
    dot.className = "exp-dot";
    layer.appendChild(dot);
    const anim = dot.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        {
          transform: `translate(${window.innerWidth / 2 - 24}px, ${-(window.innerHeight / 2 - 24)}px) scale(0)`,
          opacity: 0,
        },
      ],
      { duration: 700, easing: "ease-in" },
    );
    anim.onfinish = () => dot.remove();
  }, [activeIndex]);

  const handleDoubleClick = (index: number) => {
    imgRefs.current[index]?.animate(
      [
        { transform: "scale(1) rotate(0deg)" },
        { transform: "scale(1.08) rotate(2deg)" },
        { transform: "scale(1) rotate(0deg)" },
      ],
      { duration: 220, easing: "ease-in-out" },
    );
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Layer for the transient "exp dot" particles — kept outside the frame's
          overflow-hidden boundary so dots can fly freely across the screen. */}
      <div ref={dotLayerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40" />

      {/* The frame itself never moves — only its contents (the scroll-snap track
          below) slide when navigating between photos, like a stationary player. */}
      <div className="relative h-full w-full overflow-hidden bg-black sm:h-[88vh] sm:max-w-[420px] sm:rounded-3xl sm:shadow-2xl sm:ring-1 sm:ring-white/10">
        <div
          ref={containerRef}
          className="feed-scroll h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain"
        >
          {images.map((image, index) => (
            <div
              key={index}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="relative flex h-full w-full snap-start snap-always items-center justify-center overflow-hidden"
            >
              {/* Blurred, width-filling copy of the same photo behind it — fills the
                  frame's own letterboxing instead of leaving it bare black. Scoped to
                  this card only (unlike the earlier full-viewport version), so the
                  page-level backdrop outside the card stays a static, calm gradient. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt=""
                aria-hidden="true"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-70 blur-2xl"
              />
              <div className="absolute inset-0 bg-black/30" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={(el) => {
                  imgRefs.current[index] = el;
                }}
                src={image.src}
                alt={image.alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                referrerPolicy="no-referrer"
                onDoubleClick={() => handleDoubleClick(index)}
                className="relative z-10 will-change-transform max-h-full max-w-full object-contain"
              />
              {image.caption && (
                <p className="absolute inset-x-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10 text-center text-sm text-white drop-shadow-md">
                  {image.caption}
                </p>
              )}
              <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2">
                <ImageBookmarkButton
                  src={image.src}
                  alt={image.alt}
                  caption={image.caption}
                  postSlug={image.postSlug}
                  postTitle={image.postTitle}
                />
              </div>
            </div>
          ))}

          {/* Trailing snap-slide so scrolling past the last photo doesn't just dead-end
              at a blank frame — makes "you've reached the end" explicit and offers a
              way back without hunting for the close button. */}
          <div className="relative flex h-full w-full snap-start snap-always flex-col items-center justify-center gap-4 bg-black px-6 text-center">
            <p className="text-sm text-white/70">写真は以上です</p>
            {endHref ? (
              <Link
                href={endHref}
                className="flex items-center gap-1 rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:opacity-90"
              >
                {endLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={onEnd}
                className="flex items-center gap-1 rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:opacity-90"
              >
                {endLabel}
              </button>
            )}
          </div>
        </div>

        {/* Chrome anchored to the frame itself (not the viewport), so it stays put
            with the player rather than the backdrop around it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/50 to-transparent"
        />
        {images.length > 1 && (
          <>
            <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-150 ${
                    i <= activeIndex ? "bg-white" : "bg-white/25"
                  }`}
                />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="absolute right-3 top-9 z-20 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white"
            >
              {activeIndex + 1} / {images.length}
            </div>
            {/* Mouse/trackpad users get no swipe affordance the way touch users do —
                nudge them toward scrolling/arrow keys, then fade out for good once
                they've scrolled once. Hidden on touch devices via the pointer-fine
                variant since swipe is already self-evident there. */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 bottom-6 z-20 hidden flex-col items-center gap-1 text-white/80 transition-opacity duration-500 pointer-fine:flex ${
                hasScrolled ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="text-xs">スクロールで次へ</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                className="animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </>
        )}
      </div>
      <div aria-live="polite" className="sr-only">
        {activeIndex + 1} / {images.length}枚目
      </div>
    </div>
  );
}
