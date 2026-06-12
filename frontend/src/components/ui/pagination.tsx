import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}: PaginationProps) {
  // Nếu chỉ có 1 trang hoặc không có trang nào, không hiển thị bộ phân trang
  if (totalPages <= 1) return null;

  // Tính toán khoảng bản ghi đang hiển thị (ví dụ: Hiển thị 1 - 10 của 80 mục)
  const startItem = (currentPage - 1) * (pageSize || 0) + 1;
  const endItem = Math.min(currentPage * (pageSize || 0), totalItems || 0);

  // Tạo mảng số trang hiển thị thông minh (có dấu ba chấm rút gọn)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Số trang tối đa hiển thị cùng một lúc

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/40 bg-white/40 backdrop-blur-sm rounded-b-2xl">
      {/* Thông tin số lượng dòng (bên trái) */}
      {pageSize !== undefined && totalItems !== undefined ? (
        <p className="text-xs font-semibold text-text-secondary">
          Hiển thị <span className="text-primary font-bold">{startItem}</span> -{" "}
          <span className="text-primary font-bold">{endItem}</span> trong số{" "}
          <span className="text-text-primary font-black">{totalItems}</span> mục
        </p>
      ) : (
        <div />
      )}

      {/* Điều khiển chuyển trang (bên phải) */}
      <div className="flex items-center gap-1">
        {/* Nút về trang đầu */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-border/50 hover:bg-primary/5 hover:border-primary/50 text-text-secondary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-border/50 transition-all cursor-pointer"
          title="Trang đầu"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Nút về trang trước */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-border/50 hover:bg-primary/5 hover:border-primary/50 text-text-secondary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-border/50 transition-all cursor-pointer"
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Hiển thị trang 1 và dấu ... nếu trang hiện tại ở xa trang đầu */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                currentPage === 1
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "border-border/50 hover:bg-primary/5 hover:border-primary/50 text-text-secondary"
              }`}
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="px-1 text-text-secondary/50 text-xs select-none">...</span>}
          </>
        )}

        {/* Các trang nằm ở giữa */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              currentPage === page
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-border/50 hover:bg-primary/5 hover:border-primary/50 text-text-secondary"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Hiển thị dấu ... và trang cuối nếu trang hiện tại ở xa trang cuối */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-1 text-text-secondary/50 text-xs select-none">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                currentPage === totalPages
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "border-border/50 hover:bg-primary/5 hover:border-primary/50 text-text-secondary"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Nút sang trang sau */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-border/50 hover:bg-primary/5 hover:border-primary/50 text-text-secondary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-border/50 transition-all cursor-pointer"
          title="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Nút về trang cuối */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-border/50 hover:bg-primary/5 hover:border-primary/50 text-text-secondary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-border/50 transition-all cursor-pointer"
          title="Trang cuối"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
