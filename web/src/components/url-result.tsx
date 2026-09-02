type UrlResultProps = {
  shortUrl: string;
};

const UrlResult = ({ shortUrl }: UrlResultProps) => {
  return (
    <section className="url-result">
      {shortUrl ? (
        <p className="short-url">
          Short link:{" "}
          <a href={shortUrl} rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      ) : null}
    </section>
  );
};

export default UrlResult;
