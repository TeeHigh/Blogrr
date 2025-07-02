//styles
import "../styles/Home.scss";

//components
import BlogsContainer from "../components/BlogsContainer";
import Loader from "../components/Loader";
import Search from "../components/Search";
import Header from "../components/Header";

//hooks
import { useGetBlogs } from "../hooks/useGetBlogs";

const Home = () => {
  const { blogsData = [], isLoadingBlogs } = useGetBlogs();

  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* Blog List Section */}
      {isLoadingBlogs ? (
        <Loader />
      ) : (
        <main className="main">
          {blogsData.length > 0 && (
            <div>
              <h2 className="blog-subheader">Blog Posts</h2>
              <Search placeholder="Search blog, tags or author..."/>
            </div>
          )}
          {blogsData.length > 0 ? (
            <BlogsContainer blogs={blogsData} />
          ) : (
            <p className="unavailable">No blogs available. Check back later!</p>
          )}
        </main>
      )}

      
    </div>
  );
};

export default Home;
