
import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { useSearchParams } from "react-router";
import { createShortUrl } from "../api/mutations/createShortUrl";
import listUrls from "../api/queries/listUrls";
import useAuthedApiClient from "../hooks/useAuthedApiClient";



const UrlContext = createContext(undefined);

export function UrlProvider({ children }) {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    pageIndex: Number(searchParams.get("page"))
      ? Number(searchParams.get("page")) - 1
      : 0,
    pageSize: 10,
  });
  const authedApiClient = useAuthedApiClient();
  const createShortUrlMutation = useMutation({
    mutationFn: (longUrl) => createShortUrl(authedApiClient, longUrl),
  });
  const { data } = useQuery({
    queryFn: () =>
      listUrls(
        authedApiClient,
        pagination,
        searchParams.get("search")?.toString()
      ),
    queryKey: ["LIST_URLS", pagination, searchParams.get("search")],
  });

  const addUrl = async (originalUrl) => {
    return await createShortUrlMutation.mutateAsync(originalUrl);
  };

  return (
    <UrlContext.Provider
      value={{
        urlsData: data,
        addUrl,
        setPagination,
        pagination,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
}

export function useUrl() {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error("useUrl must be used within a UrlProvider");
  }
  return context;
}
