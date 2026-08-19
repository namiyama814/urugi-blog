"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageReel, type ReelImage } from "@/components/ImageReel";

interface PostContentProps {
  html: string;
  postSlug: string;
  postTitle: string;
}

export function PostContent({ html, postSlug, postTitle }: PostContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<ReelImage[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // The container is only ever populated once (via dangerouslySetInnerHTML, keyed off
  // `html`), so the image list only needs to be collected once per post, not per click.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const list: ReelImage[] = Array.from(container.querySelectorAll("img")).map(
      (img, index) => {
        img.dataset.reelIndex = String(index);
        const caption = img.closest("figure")?.querySelector("figcaption")?.textContent?.trim();
        return {
          src: img.currentSrc || img.src,
          alt: img.alt,
          caption: caption || undefined,
          postSlug,
          postTitle,
        };
      },
    );
    setImages(list);
  }, [html, postSlug, postTitle]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName !== "IMG") return;
    const index = Number((target as HTMLImageElement).dataset.reelIndex);
    if (Number.isNaN(index)) return;
    setOpenIndex(index);
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="post-content"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {openIndex !== null && (
        <ImageReel images={images} initialIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
