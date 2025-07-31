import { Link } from "react-router-dom";
import { BlogPost } from "../../types/types";
import { ArrowRight, Calendar, Clock } from "lucide-react";

type HomepageBlogItemProps = {
  post: BlogPost;
}

function HomepageBlogItem({ post }: HomepageBlogItemProps) {

  return (
    <article
      key={post.id}
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300 overflow-hidden break-inside-avoid"
    >
      {post.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link
            to={`/blog/${post.id}`}
            className="hover:text-secondary transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-3 ">
            <img
              src={post.author_avatar || '/assets/avatars/default.png'}
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover" // Increased size for better visibility
              style={{ objectFit: 'cover' }} // Ensures the image covers the space without being squeezed
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{post.author}</p>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-3 w-3" />
                {post.published_at && (
                  <span>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}
                <Clock className="h-3 w-3 ml-2" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>

      </div>
      <Link
        to={`/blog/${post.id}`}
        className=" bg-slate-100 rounded-xl text-blue-600 hover:text-secondary font-medium text-sm flex items-center justify-center gap-1 mt-4 py-2"
      >
        Continue reading
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
    </article >
  );
}

export default HomepageBlogItem;
