import { Copy } from "lucide-react";
import { Button } from "../../components/ui/button";

const urlTableColumns = (toast) => [
  {
    accessorKey: "long_url",
    header: "Original URL",
  },
  {
    accessorKey: "short_url",
    header: "Short URL",
    cell: (data) => {
      const shortURL = `${window.location.origin}/${data.row.original.short_url}`;
      return (
        <div className="flex items-center gap-2">
          <a target="_blank" href={shortURL} rel="noopener noreferrer">
            {shortURL}
          </a>
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(shortURL);
              toast({
                variant: "default",
                title: "Copied",
                description: "Copied to clipboard",
              });
            }}
          >
            <Copy />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    accessorFn: (data) => new Date(data.created_at).toLocaleString(),
  },
  {
    accessorKey: "click_count",
    header: "Clicks",
  },
];
export { urlTableColumns };
