/**
 * Get the base URL with a guaranteed trailing slash.
 * Works in both development (/) and production (/repo-name/).
 */
export function getBaseUrl(): string {
  const baseUrl = import.meta.env.BASE_URL;
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export function getPlaceHolderImageSrc(): string {
  return `${getBaseUrl()}images/placeholder.png`;
}

/**
 * Normalize HTTP URLs to HTTPS in WordPress content to prevent mixed content errors.
 * Specifically targets foodfocusthailand.com domain URLs.
 */
export function normalizeContentUrls(html: string): string {
  if (!html) return html;
  
  // Replace HTTP with HTTPS for foodfocusthailand.com domain (with and without www)
  return html
    .replace(/http:\/\/www\.foodfocusthailand\.com/g, 'https://www.foodfocusthailand.com')
    .replace(/http:\/\/foodfocusthailand\.com/g, 'https://foodfocusthailand.com');
}
