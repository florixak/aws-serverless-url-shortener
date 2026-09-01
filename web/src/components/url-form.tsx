import React from "react";
import { getShortUrl } from "../lib/short-url";

type UrlFormProps = {
  url: string;
  setUrl: (url: string) => void;
  setShortUrl: (shortUrl: string) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
};

const UrlForm = ({
  url,
  setUrl,
  setShortUrl,
  setError,
  setLoading,
}: UrlFormProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    try {
      setLoading(true);
      const shortUrl = await getShortUrl(url);
      setShortUrl(shortUrl);
      setError("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default UrlForm;
