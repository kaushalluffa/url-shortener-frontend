const listUrls = async (authedApiClient, pagination, searchTerm) => {
  const page = (pagination?.pageIndex || 0) + 1 || 1;
  const perPage = pagination?.pageSize || 10;
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("perPage", String(perPage));
  searchParams.set("search", searchTerm || "");

  const response = await authedApiClient.get(
    `/shorten/list-urls?${searchParams.toString()}`
  );
  return response.data;
};
export default listUrls;
