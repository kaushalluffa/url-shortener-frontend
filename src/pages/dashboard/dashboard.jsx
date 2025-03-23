import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useUrl } from "../../context/url-context";
import { useToast } from "../../hooks/use-toast";
import { urlTableColumns } from "./columns";
import { UrlDataTable } from "./data-table";

export default function DashboardPage() {
  const { urlsData, setPagination, pagination } = useUrl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const tableColumns = urlTableColumns(toast);
  const table = useReactTable({
    data: urlsData?.listOfUrls || [],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: urlsData?.totalCount,
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
  });
  function searchSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchTerm = formData.get("search");
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1");
    newSearchParams.set("search", searchTerm);
    navigate(`?${newSearchParams.toString()}`);
    setPagination({ pageIndex: 0, pageSize: 10 });
  }
  function goToNextPage() {
    const page = Number(searchParams.get("page") || 1) + 1 || 1;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", String(page));
    navigate(`?${newSearchParams.toString()}`);
    table.nextPage();
  }
  function goToPreviousPage() {
    const page = Number(searchParams.get("page") || 1) - 1 || 1;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", String(page));
    navigate(`?${newSearchParams.toString()}`);
    table.previousPage();
  }
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

      <form onSubmit={searchSubmitHandler}>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search URLs by Original URL..."
            className="max-w-sm"
            name="search"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      <div className="rounded-md border overflow-x-auto">
        <UrlDataTable
          table={table}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          columnsLength={tableColumns.length}
        />
      </div>
    </div>
  );
}
