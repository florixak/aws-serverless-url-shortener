import { useState } from "react";
import UrlForm from "./url-form";
import UrlResult from "./url-result";

const Main = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="main">
      <UrlForm
        url={url}
        setUrl={setUrl}
        setShortUrl={setShortUrl}
        setError={setError}
        setLoading={setLoading}
      />
      <UrlResult error={error} loading={loading} shortUrl={shortUrl} />
    </main>
  );
};

export default Main;
