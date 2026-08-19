"use client";

import { useState } from "react";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231ZM17.083 19.77h1.833L7.084 4.126H5.117Z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
      <path d="M12 2C6.477 2 2 5.756 2 10.4c0 4.166 3.556 7.653 8.356 8.312.325.07.767.215.879.494.101.253.066.65.032.906l-.142.855c-.04.253-.196.99.868.54 1.064-.451 5.74-3.379 7.83-5.786C21.29 13.855 22 12.21 22 10.4 22 5.756 17.523 2 12 2Zm-3.5 11.05H6.7a.35.35 0 0 1-.35-.35V8.4a.35.35 0 0 1 .7 0v3.95h1.45a.35.35 0 0 1 0 .7Zm1.85-.35a.35.35 0 0 1-.7 0V8.4a.35.35 0 0 1 .7 0Zm4.6 0a.35.35 0 0 1-.626.216l-2.174-2.888v2.672a.35.35 0 0 1-.7 0V8.4a.35.35 0 0 1 .626-.216l2.174 2.888V8.4a.35.35 0 0 1 .7 0Zm2.9-2.65h-1.45v1.05h1.45a.35.35 0 0 1 0 .7h-1.45v1.2h1.45a.35.35 0 0 1 0 .7h-1.8a.35.35 0 0 1-.35-.35V8.4a.35.35 0 0 1 .35-.35h1.8a.35.35 0 0 1 0 .7Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1 1" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-2 2a5 5 0 0 0 7.07 7.07l1-1" />
    </svg>
  );
}

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const shareToX = () => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.set("text", title);
    url.searchParams.set("url", window.location.href);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  const shareToLine = () => {
    const url = new URL("https://social-plugins.line.me/lineit/share");
    url.searchParams.set("url", window.location.href);
    url.searchParams.set("text", title);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context); silently ignore.
    }
  };

  return (
    <div className="mt-8 flex items-center gap-2 border-t border-foreground/10 pt-6">
      <span className="mr-1 text-sm text-foreground/60">シェア</span>
      <button
        type="button"
        onClick={shareToX}
        aria-label="Xでシェア"
        title="Xでシェア"
        className="rounded-full p-2 text-foreground hover:bg-foreground/10"
      >
        <XIcon />
      </button>
      <button
        type="button"
        onClick={shareToLine}
        aria-label="LINEでシェア"
        title="LINEでシェア"
        className="rounded-full p-2 text-foreground hover:bg-foreground/10"
      >
        <LineIcon />
      </button>
      <button
        type="button"
        onClick={copyLink}
        aria-label="リンクをコピー"
        title="リンクをコピー"
        className="rounded-full p-2 text-foreground hover:bg-foreground/10"
      >
        <LinkIcon />
      </button>
      {copied && <span className="text-sm text-foreground/60">コピーしました</span>}
    </div>
  );
}
