import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { useBlogContext } from "../contexts/BlogContext";
import Header from "../components/Header";
import OverlayLoader from "../components/OverlayLoader";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { useSingleBlog } = useBlogContext();
  const { data: post, isLoading } = useSingleBlog(id || "");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {isLoading && <OverlayLoader />}

      {!post ? (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post not found
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to home
          </Link>
        </div>
      ) : (
        <article className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to articles
            </Link>
          </div>

          {post.coverImage && (
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={post.author_avatar?.url || post.author_avatar || "/assets/avatars/default.png"}
                    alt={post.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.published_at &&
                          new Date(post.published_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min read
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </header>

            <div
              className="prose prose-lg max-w-none leading-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>
        </article>
      )}
    </div>
  );
}
