import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "@mantine/core";
import { Plus, Search, Filter } from "lucide-react";
import { useBlogContext } from "../../contexts/BlogContext";
import PostList from "./blog-management/PostList";
import OverlayLoader from "../OverlayLoader";
import { BlogPost } from "../../types/types";

import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import useDashboardPosts from "../../hooks/dashboardHooks/useDashboardPosts";

export default function BlogManagement() {
  const { useDeleteBlog, setEditingBlog } = useBlogContext();
  const { mutate: deletePost } = useDeleteBlog();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page") ?? "1") || 1;

  const {
    data: dashboardPosts = { results: [] },
    isFetching: isFetchingDashPost,
  } = useDashboardPosts();

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(dashboardPosts.count / PAGE_SIZE);
  const firstItemIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const lastItemIndex = Math.min(
    firstItemIndex + PAGE_SIZE - 1,
    dashboardPosts.count
  );

  const handlePageChange = (newPage: string) => {
    searchParams.set("page", newPage);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      searchParams.set("search", value);
    } else {
      searchParams.delete("search");
    }

    searchParams.set("page", "1"); // reset to first page
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "all" | "published" | "draft";
    setFilterStatus(value);

    if (value === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", value);
    }

    searchParams.set("page", "1"); // reset to first page
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  useEffect(() => {
    const status =
      (searchParams.get("status") as "all" | "published" | "draft") || "all";
    setFilterStatus(status);
    setSearchTerm(searchParams.get("search") || "");
  }, [location.search]);

  if (isFetchingDashPost) return <OverlayLoader />;

  const openDeleteModal = (id: string) => {
    modals.openConfirmModal({
      title: "Delete blog post",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this post? This action is destructive
          and cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete post", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deletePost(id),
    });
  };

  console.log(dashboardPosts);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600">Manage your blog posts and drafts</p>
        </div>
        <Link
          to="/dashboard/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {dashboardPosts.count > 0 && (
        <p className="text-gray-500 text-sm text-center sm:text-right bg-white rounded-lg shadow-sm border p-4">
          {`Showing ${firstItemIndex} to ${lastItemIndex} of ${dashboardPosts.count} posts`}{" "}
        </p>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-y-auto">
        {dashboardPosts.results.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {dashboardPosts.results.map((post: BlogPost) => (
              <PostList
                key={post.id}
                post={post}
                openDeleteModal={openDeleteModal}
                setEditingBlog={setEditingBlog}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-100 rounded-full p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start creating your first blog post"}
              </p>
              <Link
                to="/dashboard/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Post
              </Link>
            </div>
          </div>
        )}
      </div>
      {dashboardPosts.results.length >= PAGE_SIZE && (
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-6">
          <Pagination
            total={totalPages}
            display={"flex"}
            value={currentPage}
            onChange={(page) => {
              handlePageChange(page.toString());
            }}
          />
          <p className="text-gray-500 text-sm">{`Page ${currentPage} of ${totalPages}`}</p>
        </div>
      )}
    </div>
  );
}
