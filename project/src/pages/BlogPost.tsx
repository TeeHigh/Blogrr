import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';
import Header from '../components/Header';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { getPost } = useBlog();
  const post = id ? getPost(id) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
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
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
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

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{paragraph.substring(2)}</h1>;
              } else if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{paragraph.substring(3)}</h2>;
              } else if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">{paragraph.substring(4)}</h3>;
              } else if (paragraph.trim() === '') {
                return <br key={index} />;
              } else {
                return <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>;
              }
            })}
          </div>
        </div>
      </article>
    </div>
  );
}