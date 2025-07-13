
import { Link } from 'react-router-dom';
import { FileText, Eye, Clock, TrendingUp, PlusCircle, MessageCircle } from 'lucide-react';
import { useBlog } from '../../contexts/BlogContext';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardOverview() {
  const { posts } = useBlog();
  const { user } = useAuth();
  
  const userPosts = posts.filter(post => post.author === user?.name);
  const publishedPosts = userPosts.filter(post => post.status === 'published');
  const draftPosts = userPosts.filter(post => post.status === 'draft');

  const stats = [
    {
      name: 'Total Posts',
      value: userPosts.length.toString(),
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Published',
      value: publishedPosts.length.toString(),
      icon: Eye,
      color: 'bg-green-500'
    },
    {
      name: 'Drafts',
      value: draftPosts.length.toString(),
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      name: 'Total Views',
      value: '1.2K',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">Here's what's happening with your blog</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/create"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            New Post
          </Link>
          <Link
            to="/dashboard/chat"
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
        </div>
        <div className="p-6">
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {post.status === 'published' ? 'Published' : 'Draft'} • {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
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