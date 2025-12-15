import { useEffect } from 'react';

interface UseRefreshProps {
  page: number;
  pageSize: number;
  currentPageItemCount: number;
  total?: number;
  isLoading?: boolean;
  setPage: (page: number | ((prev: number) => number)) => void;
  refetch: () => void;
}

// /**
//  * Tự động back page nếu dữ liệu hiện tại bị trống
//  * - Nếu có total → tính toán dựa trên total
//  * - Nếu không có total → kiểm tra nếu trang hiện tại chỉ còn 1 item thì back page
//  *
//  * Sau khi back page hoặc không cần back page thì sẽ gọi refetch lại dữ liệu
//  */
// export function useRefresh({
//   page,
//   pageSize,
//   currentPageItemCount,
//   total,
//   setPage,
//   refetch,
// }: UseRefreshProps) {
//   return useCallback(() => {
//     // Nếu có total → dùng cách chuẩn enterprise
//     if (typeof total === 'number') {
//       const totalAfterEmpty = total - 1;
//       const maxPageAfterEmpty = Math.ceil(totalAfterEmpty / pageSize);

//       if (page > maxPageAfterEmpty) {
//         setPage(maxPageAfterEmpty > 0 ? maxPageAfterEmpty : 1);
//         return;
//       }
//     }

//     // Fallback: nếu trang hiện tại chỉ còn 1 item
//     if (currentPageItemCount === 1 && page > 1) {
//       setPage((prev) => prev - 1);
//       return;
//     }

//     // Trường hợp còn item → refetch lại
//     refetch();
//   }, [page, pageSize, currentPageItemCount, total, setPage, refetch]);
// }

/**
 * Tự động back page khi page hiện tại rỗng
 * - Hoạt động đúng cho multi-tab / external delete
 * - Không đoán nguyên nhân thay đổi data
 */
export function useRefresh({
  page,
  pageSize,
  currentPageItemCount,
  total,
  isLoading,
  setPage,
}: UseRefreshProps) {
  useEffect(() => {
    // Không làm gì nếu đang ở page 1

    if (page <= 1 || isLoading) return;

    // Nếu page hiện tại rỗng → back page
    if (!currentPageItemCount) {
      // Nếu có total thì tính page tối đa
      if (typeof total === 'number') {
        const maxPage = Math.ceil(total / pageSize) || 1;
        setPage(Math.min(page - 1, maxPage));
      } else {
        setPage((prev) => prev - 1);
      }
      return;
    }
  }, [page, pageSize, currentPageItemCount, total, setPage, isLoading]);
}
