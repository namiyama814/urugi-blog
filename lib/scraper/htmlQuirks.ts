/**
 * The source site never closes `<ul class="list">` before the following
 * `<div class="pgno">` pagination wrapper — real browsers (and parse5/htmlparser2-based
 * parsers like cheerio) auto-close it per the HTML5 parsing algorithm, but
 * node-html-parser doesn't implement that recovery and ends up corrupting the whole
 * tree (the `<ul>`, and even the enclosing `<article>`, vanish from the parsed output).
 * Insert the missing `</ul>` so downstream selectors see a well-formed tree.
 */
export function closeUnclosedListTag(html: string): string {
  return html.replace('<div class="pgno">', '</ul><div class="pgno">');
}
