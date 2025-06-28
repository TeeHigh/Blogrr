import api from "../api";

export async function getDashboardData() {
  try {
    const response = await api.get("/api/dashboard/");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export async function getBlogs() {
  try {
    const response = await api.get("/api/blogs/");
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
}

export async function getBlogById(id) {
  try {
    const response = await api.get(`/api/blog/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
}

export async function createBlog(newBlogData) {
  try {
    const response = await api.post("/api/blog/create/", newBlogData);
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}

export async function updateBlog(id, blogData) {
  console.log(blogData);
  try {
    const response = await api.put(`/api/blog/${id}/`, blogData);
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}

export async function deleteBlog(id) {
  try {
    const res = await api.delete(`/api/blog/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}
