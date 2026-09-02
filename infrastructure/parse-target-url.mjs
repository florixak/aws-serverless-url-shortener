const MAX_TARGET_URL_LENGTH = 2048;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

export function parseTargetUrl(raw) {
  if (typeof raw !== "string") return null;

  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_TARGET_URL_LENGTH) {
    return null;
  }

  if (CONTROL_CHARS.test(trimmed)) return null;

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (!url.hostname) return null;
  if (url.username || url.password) return null;

  return url;
}
