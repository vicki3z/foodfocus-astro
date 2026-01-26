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
