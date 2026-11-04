/** «1,2 МБ», «640 КБ» for file sizes. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} КБ`;
  return `${(kb / 1024).toLocaleString('uk-UA', { maximumFractionDigits: 1 })} МБ`;
}

/** «1200 × 800» or `null` when the size is unknown (files registered from the CDN). */
export function formatDimensions(width: number | null, height: number | null): string | null {
  return width && height ? `${width} × ${height}` : null;
}
