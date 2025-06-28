import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlog as deleteBlogApi } from "../services/apiBlogs";


export function useDeleteBlog(){
  const queryClient = useQueryClient();
  
  const {mutate: deleteBlog, isPending: isDeletingBlog} = useMutation({
    mutationFn: deleteBlogApi,
    mutationKey: ('blog'),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog']),
      alert('Blog deleted successfully!')
    },
    onError: (error) => {
      alert('Error deleting blog');
      console.error(error);
      throw new Error(error.message);
    }
  })

  return {deleteBlog, isDeletingBlog}
}
