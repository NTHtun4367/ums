import { memo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  loading?: boolean;
}

const CustomPagination = memo(
  ({ page, setPage, totalPages, loading }: Props) => {
    if (totalPages <= 1) return null;

    const handlePageClick = (e: React.MouseEvent, targetPage: number) => {
      e.preventDefault();
      if (
        !loading &&
        targetPage !== page &&
        targetPage > 0 &&
        targetPage <= totalPages
      ) {
        setPage(targetPage);
      }
    };

    const renderPageNumbers = () => {
      const items = [];
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={page === i}
                onClick={(e) => handlePageClick(e, i)}
                className={
                  loading ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        } else if (i === page - 2 || i === page + 2) {
          items.push(
            <PaginationItem key={i}>
              <PaginationEllipsis />
            </PaginationItem>,
          );
        }
      }
      return items;
    };

    return (
      <div className="py-4 border-t px-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => handlePageClick(e, page - 1)}
                className={
                  page === 1 || loading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => handlePageClick(e, page + 1)}
                className={
                  page === totalPages || loading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  },
);

export default CustomPagination;
