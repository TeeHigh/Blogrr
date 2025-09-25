export const searchParams = new URLSearchParams(location.search);

export const paginationConstants = {
  pageNumber : Number(searchParams.get("page") || "1"),
  searchTerm : searchParams.get("search") || "",
  filterStatus : searchParams.get("status") || "all",
}