import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { Button } from "../../components/ui/button";
import { UrlData } from "../../context/url-context";
import { ToasterToast } from "../../hooks/use-toast";

const urlTableColumns: (
  toast: ({ ...props }: Omit<ToasterToast, "id">) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  }
) => ColumnDef<UrlData>[] = (toast) => [
  {
    accessorKey: "long_url",
    header: "Original URL",
  },
  {
    accessorKey: "short_url",
    header: "Short URL",
    cell: (data: CellContext<UrlData, unknown>) => {
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
