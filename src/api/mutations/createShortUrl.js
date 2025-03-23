export const createShortUrl = async (authedApiClient, url) => {
  const response = await authedApiClient.post("/shorten/create-short-url", {
    long_url: url,
  });
  return response.data;
};
