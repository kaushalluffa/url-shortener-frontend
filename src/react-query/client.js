import { QueryClient } from "@tanstack/react-query";
export const rtkClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
        }
    }
});
