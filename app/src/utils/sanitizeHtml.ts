/** Strip everything that could execute or restyle the page out of CMS HTML.
    Applied at the data layer (Part 2) so the query cache only ever holds
    safe markup; components then render it inside `prose prose-sm max-w-none`. */
export function sanitizeCmsHtml(input: string | null | undefined): string | null {
  if (!input) return null;
  return input
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<link\b[^>]*\/?>/gi, '')
    .replace(/<meta\b[^>]*\/?>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*\/?>/gi, '')
    .replace(/\s(?:style|on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/url\s*\(\s*[^)]*\)/gi, '');
}

export function sanitizeCmsHtmlMap<T extends object>(obj: T | null | undefined): T | null {
  if (!obj) return null;
  const out: Record<string, string | null> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === 'string' ? sanitizeCmsHtml(v) : (v as null);
  }
  return out as unknown as T;
}
