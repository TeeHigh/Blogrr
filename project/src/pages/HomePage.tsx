import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';
import Header from '../components/Header';
import Hero from '../components/homepage/Hero';

export default function HomePage() {
  const { posts } = useBlog();
  const publishedPosts = posts.filter(post => post.status === 'published');

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Featured Posts */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {publishedPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300 overflow-hidden break-inside-avoid">
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
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{post.author}</p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                  >
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}