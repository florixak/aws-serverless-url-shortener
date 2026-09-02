const getShortUrl = async (url: string): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/links`, {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data.shortUrl;
};

export { getShortUrl };
