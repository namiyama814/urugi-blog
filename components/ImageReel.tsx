"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageBookmarkButton } from "@/components/ImageBookmarkButton";

export interface ReelImage {
  src: string;
  alt: string;
  caption?: string;
  /** Post this image belongs to, so it can be bookmarked individually — set
   * per image (not once for the whole reel) since a bookmarks-tab reel can
   * mix photos from different posts. */
  postSlug: string;
  postTitle: string;
}

interface ImageReelProps {
  images: ReelImage[];
  initialIndex: number;
  onClose: () => void;
}

const SWIPE_THRESHOLD_PX = 50;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export function ImageReel({ images, initialIndex, onClose }: ImageReelProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const goPrev = useCallback(() => setCurrentIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(
    () => setCurrentIndex((i) => Math.min(images.length - 1, i + 1)),
    [images.length],
  );

  const close = useCallback(() => {
    // Guards against closing before the enter transition has actually started
    // (e.g. Escape pressed within the same frame as opening), which would
    // otherwise leave the backdrop mounted at opacity-0 with no transitionend to clear it.
    if (!isOpen) {
      onClose();
      return;
    }
    setIsOpen(false);
  }, [isOpen, onClose]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, goPrev, goNext]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX > SWIPE_THRESHOLD_PX) goPrev();
    else if (deltaX < -SWIPE_THRESHOLD_PX) goNext();
  };

  const current = images[currentIndex];
  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || "写真"}
      className={`fixed inset-0 z-50 flex flex-col bg-black/90 transition-opacity duration-200 motion-reduce:transition-none ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={close}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && !isOpen) onClose();
      }}
    >
      {images.length > 1 && (
        <div className="flex gap-1 px-4 pt-4" aria-hidden="true">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-150 ${
                i <= currentIndex ? "bg-white" : "bg-white/25"
              }`}
            />
          ))}
        </div>
      )}

      <div aria-live="polite" className="sr-only">
        {currentIndex + 1} / {images.length}枚目
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="閉じる"
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white hover:bg-white/10"
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

      <div
        className="reel-track flex flex-1 touch-none transition-transform duration-200 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, i) => (
          <div
            key={i}
            className="flex w-full shrink-0 flex-col items-center justify-center gap-3 p-4"
          >
            {/* Bookmark button anchors to the image's own corner (not the slide's),
                so it stays clear on desktop where the image is much smaller than
                the viewport instead of stranding the button in a far corner. */}
            <div className="relative" onClick={(event) => event.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-[80vh] max-w-full rounded-lg object-contain"
              />
              <div className="absolute bottom-2 right-2 z-10">
                <ImageBookmarkButton
                  src={image.src}
                  alt={image.alt}
                  caption={image.caption}
                  postSlug={image.postSlug}
                  postTitle={image.postTitle}
                />
              </div>
            </div>
            {image.caption && (
              <p className="max-w-full text-center text-sm text-white/70">{image.caption}</p>
            )}
          </div>
        ))}
      </div>

      {hasPrev && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          aria-label="前の写真"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/10"
        >
          <ChevronIcon direction="left" />
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          aria-label="次の写真"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/10"
        >
          <ChevronIcon direction="right" />
        </button>
      )}

      {images.length > 1 && (
        <p className="pb-4 text-center text-xs text-white/50" aria-hidden="true">
          {currentIndex + 1} / {images.length}
        </p>
      )}
    </div>
  );
}
