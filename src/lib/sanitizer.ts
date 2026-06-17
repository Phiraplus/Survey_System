/**
 * Minimalist input sanitization utility to prevent basic XSS and injection.
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '') // Remove script tags
    .replace(/[<>]/g, (tag) => {
      const replacements: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;'
      };
      return replacements[tag] || tag;
    });
}
