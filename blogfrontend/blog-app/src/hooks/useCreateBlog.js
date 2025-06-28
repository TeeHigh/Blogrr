import { useMutation, useQueryClient } from '@tanstack/react-query';
import {createBlog as createBlogApi} from '../services/apiBlogs';
import { toast } from 'react-toastify';

function useCreateBlog(onClose, resetForm){
  const queryClient = useQueryClient();

  const {mutate: createBlog, isPending: isCreatingBlog} = useMutation({
    mutationFn: (newBlogData) => createBlogApi(newBlogData),
    mutationKey: ['createBlog'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success("Blog created successfully!");
      resetForm();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog. Please try again.");
    }
  });

  return {
    createBlog,
    isCreatingBlog
  };
}

export default useCreateBlog;