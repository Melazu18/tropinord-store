export function unescapeNewlines(text?: string | null) {
  if (!text) return "";
  // Convert literal "\n" sequences to actual line breaks
  return text.replace(/\\n/g, "\n");
}
