export function PostContent({ html }: { html: string }) {
  return (
    <div
      className="post-content max-w-none [&_a]:underline [&_img]:h-auto [&_img]:max-w-full [&_p]:mb-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
