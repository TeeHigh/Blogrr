import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllBlogsApi,
  getPublishedBlogsApi,
  getBlogByIdApi,
  createBlogApi,
  deleteBlogApi,
  updateBlogApi,
} from "../services/blogService";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { BlogPost } from "../types/types";
// import useCreateBlog from "../hooks/blogHooks/useCreateBlog";

type BlogContextType = {
  authorPosts: BlogPost[];
  setAuthorPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  editingBlog: BlogPost | null;
  setEditingBlog: React.Dispatch<React.SetStateAction<BlogPost | null>>;
  useBlogs: () => ReturnType<typeof useQuery<BlogPost[]>>;
  usePublishedBlogs: () => ReturnType<typeof useQuery<BlogPost[]>>;
  useSingleBlog: (id: string) => ReturnType<typeof useQuery<BlogPost>>;
  useCreateBlog: () => UseMutationResult<
    void, // What the mutation returns
    Error, // Error type
    Omit<BlogPost, "author_avatar" | "id">,
    unknown
  >;
  useUpdateBlog: () => UseMutationResult<void, Error, UpdateBlogInput, unknown>;
  useDeleteBlog: () => ReturnType<typeof useMutation<void, Error, string>>;
};

type UpdateBlogInput = {
  id: string;
  post: Partial<BlogPost>;
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);
  const [ editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Queries
  const useBlogs = () =>
    useQuery<BlogPost[]>({
      queryKey: ["blogs"],
      queryFn: getAllBlogsApi,
    });

  const usePublishedBlogs = () =>
    useQuery<BlogPost[]>({
      queryKey: ["publishedBlogs"],
      queryFn: getPublishedBlogsApi,
    });

  const useSingleBlog = (id: string) =>
    useQuery<BlogPost>({
      queryKey: ["blogs", id],
      queryFn: () => getBlogByIdApi(id),
      enabled: !!id, // prevent calling if id is empty
      staleTime: 5 * 60 * 1000,
    });

  // Mutations
  const useCreateBlog = () =>
    useMutation({
      mutationFn: async (data: Omit<BlogPost, "author_avatar" | "id">) => {
        return await toast.promise(createBlogApi(data), {
          loading: "Creating blog",
          success: "Blog created successfully!",
          error: "Error creating blog!",
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      },
      onError: (err) => console.error("Failed to create blog", err),
    });

  const useUpdateBlog = () => {
    return useMutation<void, Error, UpdateBlogInput>({
      mutationFn: async ({ id, post }) => {
        return await toast.promise(updateBlogApi(id, post), {
          loading: "Updating blog",
          success: "Blog updated successfully!",
          error: "Error updating blog!",
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      },
      onError: (err) => console.error("Failed to update blog", err),
    });
  };

  const useDeleteBlog = () =>
    useMutation({
      mutationFn: async (id: string) => {
        return await toast.promise(deleteBlogApi(id), {
          loading: "Deleting blog",
          success: "Blog deleted",
          error: "Failed to delete blog",
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      },
      onError: (err) => console.error(err),
    });

  return (
    <BlogContext.Provider
      value={{
        authorPosts,
        setAuthorPosts,
        editingBlog,
        setEditingBlog,
        useBlogs,
        usePublishedBlogs,
        useSingleBlog,
        useCreateBlog,
        useUpdateBlog,
        useDeleteBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// Custom hook to access blog context
export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogContext must be used within a BlogProvider");
  }
  return context;
};
