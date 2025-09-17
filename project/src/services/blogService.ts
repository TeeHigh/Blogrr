import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../api";
import { BlogPost } from "../types/types";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRFToken": Cookies.get("csrftoken") || "",
  },
  withCredentials: true,
};

export async function getDashboardData() {
  try {
    const response = await api.get("/api/dashboard/");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export const getAllBlogsApi = async () => {
  try {
    const response = await api.get("/api/dashboard/");
    return response.data.blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export async function getBlogByIdApi(id: string) {
  try {
    const response = await api.get(`/api/post/${id}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Blog not found");
      }
      throw new Error("Error fetching blog");
    }
    console.error("Unexpected error:", error);
    throw new Error("Unexpected error occurred");
  }
}

export async function getPublishedBlogsApi() {
  try {
    const response = await api.get("/api/posts/");
    return response.data;
  } catch (err) {
    console.error("Error fetching blogs", err);
    throw new Error("Error fetching blogs");
  }
}

export async function createBlogApi(
  data: Omit<BlogPost, "author_avatar" | "id">
) {
  try {
    const response = await api.post("/api/blog/create/", data, config);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.tags) {
        throw new Error(err.response.data.tags.join(", "));
      }
      throw new Error("Failed to create blog post");
    }
  }
}

export async function updateBlogApi(id: string, data: Partial<BlogPost>) {
  try {
    const response = await api.patch(`/api/post/${id}/`, data, config);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.tags) {
        throw new Error(err.response.data.tags.join(", "));
      }
      throw new Error("Failed to update blog post");
    }
  }
}

export async function deleteBlogApi(id: string) {
  try {
    const response = await api.delete(`/api/post/${id}/`, config);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.tags) {
        throw new Error(err.response.data.tags.join(", "));
      }
      throw new Error("Failed to delete blog post");
    }
    console.error("Unexpected error:", err);
    throw new Error("Unexpected error occurred");
  }
}
