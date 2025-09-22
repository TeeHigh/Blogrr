import { Link } from "react-router-dom";
import {
  FileText,
  Eye,
  Clock,
  TrendingUp,
  PlusCircle,
  MessageCircle,
} from "lucide-react";
// import { useBlogContext } from "../../contexts/BlogContext";
import { useAuth } from "../../contexts/AuthContext";
import { BlogPost, DashboardStat } from "../../types/types";
import DashboardStats from "./dashboard-components/DashboardStats";
import { formatDistanceToNow } from "date-fns";
import useUser from "../../hooks/dashboardHooks/useUser";
import OverlayLoader from "../OverlayLoader";

export default function DashboardOverview() {
  const { user } = useAuth();

  const { data, isPending: isFetchingDashData } = useUser();

  if (isFetchingDashData) return <OverlayLoader />

  if (!data) return;

  const authorPosts = data?.recent_blogs;

  const publishedPosts = authorPosts.filter(
    (post: BlogPost) => post.status === "published"
  ) ?? [];
  const draftPosts = authorPosts.filter((post: BlogPost) => post.status === "draft") ?? [];

  const stats: DashboardStat[] = [
    {
      name: "Total Posts",
      value: data.total_posts,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      name: "Published",
      value: data.published_posts,
      icon: Eye,
      color: "bg-green-500",
    },
    {
      name: "Drafts",
      value: data.draft_posts,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      name: "Total Views",
      value: "1.2K",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-6">
        {/* Greeting Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, <span className="lowercase">{user?.username}</span>
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your blog
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            to="/dashboard/create"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4" />
            New Post
          </Link>
          <Link
            to="/dashboard/chat"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
        </div>
        <div className="p-6">
          {authorPosts.length > 0 ? (
            <div className="space-y-4">
              {authorPosts.map((post: BlogPost) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {post.status === "published" ? "Published" : "Draft"} •{" "}
                      {/* {post.created_at !== undefined &&
                        new Date(post.created_at).toLocaleDateString()} */}
                      {post.published_at
                        ? post.published_at &&
                          formatDistanceToNow(new Date(post.published_at), {
                            addSuffix: true,
                          })
                        : post.created_at &&
                          formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                          })}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No posts yet</p>
              <Link
                to="/dashboard/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Create your first post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
