import { BlogPost } from "../../../types/types";
import { DotIcon, Edit, Eye, Trash2 } from "lucide-react";
import { format, formatRelative } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

interface PostListProps {
  post: BlogPost;
  setEditingBlog: (post: BlogPost) => void;
  handleDelete: (id: string) => void;
}

function PostList({ post, setEditingBlog, handleDelete }: PostListProps) {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors border-b"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Post Content */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 break-words">
              {post.title}
            </h3>

            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                post.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {post.status}
            </span>
            <DotIcon />
            {post.created_at && (
              <span
                className="text-xs text-gray-500 italic"
                title={`Created on ${new Date(
                  post.created_at
                ).toLocaleString()}`}
              >
                Created {formatRelative(new Date(post.created_at), new Date())}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center mt-6 gap-x-4 sm:gap-x-1 gap-y-2 text-sm text-gray-500">
            <span title="Date updated">
              Last updated on{" "}
              {post.updated_at
                ? format(new Date(post.updated_at), "EEEE 'at' p")
                : post.created_at &&
                  format(new Date(post.created_at), "EEEE 'at' p")}
            </span>

            <DotIcon className="hidden sm:inline-block" />

            <span>{post.readTime} min read</span>

            <DotIcon className={`hidden ${post.tags.length > 0 && "sm:inline-block"}`} />

            <div className="flex gap-2 flex-wrap">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col gap-2 self-start sm:self-auto">
          {post.status === "published" && (
            <Link
              to={`/blog/${post.id}`}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View post"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit post"
            onClick={() => {
              setEditingBlog(post);
              navigate(`/dashboard/edit/${post.id}`);
            }}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(post.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete post"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostList;
