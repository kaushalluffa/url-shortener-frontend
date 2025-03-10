import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import { generateShortCode } from "../lib/utils";


export type UrlData = {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
};

type UrlContextType = {
  urls: UrlData[];
  addUrl: (originalUrl: string) => Promise<UrlData>;
  getUrl: (shortCode: string) => UrlData | undefined;
  incrementClicks: (shortCode: string) => void;
  deleteUrl: (id: string) => void;
};

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export function UrlProvider({ children }: { children: React.ReactNode }) {
  const [urls, setUrls] = useState<UrlData[]>([]);

  useEffect(() => {
    // Load URLs from localStorage
    const storedUrls = localStorage.getItem("urls");
    if (storedUrls) {
      setUrls(
        JSON.parse(storedUrls).map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt),
        }))
      );
    }
  }, []);

  const saveUrls = (updatedUrls: UrlData[]) => {
    localStorage.setItem("urls", JSON.stringify(updatedUrls));
    setUrls(updatedUrls);
  };

  const addUrl = async (originalUrl: string) => {
    // Generate a unique short code
    const shortCode = generateShortCode();

    const newUrl: UrlData = {
      id: Date.now().toString(),
      originalUrl,
      shortCode,
      createdAt: new Date(),
      clicks: 0,
    };

    const updatedUrls = [...urls, newUrl];
    saveUrls(updatedUrls);

    return newUrl;
  };

  const getUrl = (shortCode: string) => {
    return urls.find((url) => url.shortCode === shortCode);
  };

  const incrementClicks = (shortCode: string) => {
    const updatedUrls = urls.map((url) =>
      url.shortCode === shortCode ? { ...url, clicks: url.clicks + 1 } : url
    );
    saveUrls(updatedUrls);
  };

  const deleteUrl = (id: string) => {
    const updatedUrls = urls.filter((url) => url.id !== id);
    saveUrls(updatedUrls);
  };

  return (
    <UrlContext.Provider
      value={{ urls, addUrl, getUrl, incrementClicks, deleteUrl }}
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
