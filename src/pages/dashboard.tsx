import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useUrl } from "../context/url-context";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { formatDate } from "../lib/utils";

export default function DashboardPage() {
  const { urls, deleteUrl } = useUrl();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUrls = urls.filter(
    (url) =>
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "URL copied",
      description: "The shortened URL has been copied to your clipboard.",
    });
  };

  const handleDelete = (id: string) => {
    deleteUrl(id);
    toast({
      title: "URL deleted",
      description: "The URL has been deleted successfully.",
    });
  };

  const getShortUrl = (shortCode: string) => {
    return `${window.location.origin}/${shortCode}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Short URL
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search URLs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableCaption>
            {urls.length === 0
              ? "No URLs found. Create your first short URL."
              : `A list of your shortened URLs. Total: ${urls.length}`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Original URL</TableHead>
              <TableHead>Short URL</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUrls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No URLs found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredUrls.map((url) => (
                <TableRow key={url.id}>
                  <TableCell className="max-w-[200px] truncate">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:underline"
                    >
                      {url.originalUrl}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <a
                        href={getShortUrl(url.shortCode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {getShortUrl(url.shortCode)}
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          copyToClipboard(getShortUrl(url.shortCode))
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(new Date(url.createdAt))}</TableCell>
                  <TableCell>{url.clicks}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(url.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
