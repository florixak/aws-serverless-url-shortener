const MAX_TARGET_URL_LENGTH = 2048;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

export type ParseTargetUrlResult =
  | { ok: true; url: URL }
  | { ok: false; message: string };

export function parseTargetUrl(raw: string): ParseTargetUrlResult {
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { ok: false, message: "Enter a link to shorten." };
  }
  if (trimmed.length > MAX_TARGET_URL_LENGTH) {
    return {
      ok: false,
      message: "That link is too long. Use 2048 characters or fewer.",
    };
  }
  if (CONTROL_CHARS.test(trimmed)) {
    return {
      ok: false,
      message: "That link is not valid. Paste a full https:// URL.",
    };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return {
      ok: false,
      message: "Enter a full URL, like https://example.com",
    };
  }

  if (url.protocol !== "https:") {
    return {
      ok: false,
      message:
        "Only https:// links are allowed. Switch http to https if the site supports it.",
    };
  }
  if (!url.hostname) {
    return {
      ok: false,
      message: "Enter a full URL, like https://example.com",
    };
  }
  if (url.username || url.password) {
    return {
      ok: false,
      message: "Remove the username and password from the URL.",
    };
  }

  return { ok: true, url };
}
