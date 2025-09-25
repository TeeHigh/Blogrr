import Header from '../components/Header';
import Hero from '../components/homepage/Hero';
import useGetPublishedBlogs from '../hooks/blogHooks/useGetPublishedBlogs';
import { BlogPost } from '../types/types';
import Loader from '../components/Loader';
import HomepageBlogItem from '../components/homepage/HomepageBlogItem';

export default function HomePage() {
  const { posts, isFetchingBlogs } = useGetPublishedBlogs();

if (isFetchingBlogs) {
  return <Loader />;
}

const publishedPosts = posts?.results ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Featured Posts */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {publishedPosts.length > 0 ? 
            publishedPosts.map((post: BlogPost) => (
              <HomepageBlogItem key={post.id} post={post} />
            )) : 
            <div className="text-center text-gray-500">
              No posts available at the moment.
              
            </div>
            }
        </div>
      </section>
    </div>
  );
}