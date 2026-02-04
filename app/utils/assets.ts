/**
 * Returns the full path to an asset, including the base URL for subdirectory deployments.
 * Use this for all image src attributes.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  // Remove leading slash from path if base already ends with one
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
