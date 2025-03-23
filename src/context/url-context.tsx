import type React from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { createShortUrl } from "../api/mutations/createShortUrl";
import listUrls from "../api/queries/listUrls";
import useAuthedApiClient from "../hooks/useAuthedApiClient";
import { Pagination } from "../types";
import { useSearchParams } from "react-router";

export type UrlData = {
  _id: string;
  long_url: string;
  short_url: string;
  created_at: Date;
  click_count: number;
};

type UrlContextType = {
  urlsData: { listOfUrls: UrlData[]; totalCount: number };
  addUrl: (originalUrl: string) => Promise<UrlData>;
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
};

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export function UrlProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: Number(searchParams.get("page"))
      ? Number(searchParams.get("page")) - 1
      : 0,
    pageSize: 10,
  });
  const authedApiClient = useAuthedApiClient();
  const createShortUrlMutation = useMutation({
    mutationFn: (longUrl: string) => createShortUrl(authedApiClient, longUrl),
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

  const addUrl = async (originalUrl: string) => {
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
