import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlog as updateBlogApi } from "../services/apiBlogs";
import { toast } from "react-toastify";

function useUpdateBlog(closeModal, resetForm) {
  const queryClient = useQueryClient();

  const { mutate: updateBlog, isPending: isUpdatingBlog } = useMutation({
    mutationFn: ({id, formData}) => updateBlogApi(id, formData),
    mutationKey: ['updateBlog'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success("Blog updated successfully!");
      resetForm(); 
      closeModal();
    },
    onError: (error) => {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog. Please try again.");
    }
  })

  return {
    updateBlog,
    isUpdatingBlog
  };
}

export default useUpdateBlog;