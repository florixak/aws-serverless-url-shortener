import React, { useRef } from "react";
import { getShortUrl } from "../lib/short-url";
import { parseTargetUrl } from "../lib/parse-target-url";

type UrlFormProps = {
  url: string;
  setUrl: (url: string) => void;
  setShortUrl: (shortUrl: string) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  error: string;
};

const UrlForm = ({
  url,
  setUrl,
  setShortUrl,
  setError,
  setLoading,
  loading,
  error,
}: UrlFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = parseTargetUrl(url);
    if (!parsed.ok) {
      setShortUrl("");
      setError(parsed.message);
      inputRef.current?.focus();
      return;
    }
    try {
      setLoading(true);
      setError("");
      setShortUrl("");
      const shortUrl = await getShortUrl(parsed.url.href);
      setShortUrl(shortUrl);
    } catch {
      setError("Couldn’t create a short link. Try again.");
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="url-form" onSubmit={handleSubmit} noValidate>
      <div className="url-form-field">
        <label htmlFor="target-url">Link to shorten</label>
        <div className="url-form-row">
          <input
            ref={inputRef}
            id="target-url"
            name="url"
            type="url"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            maxLength={2048}
            placeholder="https://example.com…"
            value={url}
            disabled={loading}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? "target-url-hint target-url-error" : "target-url-hint"
            }
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create short link"}
          </button>
        </div>
        <p id="target-url-hint" className="field-hint">
          Must start with https://
        </p>
        {error ? (
          <p id="target-url-error" className="error-message" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
};

export default UrlForm;
