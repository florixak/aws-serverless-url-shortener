type UrlResultProps = {
  error: string;
  loading: boolean;
  shortUrl: string;
};

const UrlResult = ({ error, loading, shortUrl }: UrlResultProps) => {
  return (
    <section className="url-result">
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Generating short URL...</p>}
      {shortUrl && (
        <p className="short-url">
          Short URL: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}
    </section>
  );
};

export default UrlResult;
