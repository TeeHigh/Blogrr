export const queryKeys = {
  user: ["user"],
  blogs: ["blogs"],
  publishedBlogs: ["publishedBlogs"],
  blog: (id: string) => ["blog", id],
};