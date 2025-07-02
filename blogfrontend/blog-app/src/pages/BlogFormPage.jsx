import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

import useCreateBlog from "../hooks/useCreateBlog";
import useUpdateBlog from "../hooks/useUpdateBlog";

import "../styles/NewEditBlog.scss";
import NewEditBlogForm from "../components/NewEditBlogForm";
import DashboardHeader from "../components/DashboardHeader";

const BlogFormPage = ({ mode = "create", existingFormData = {} }) => {
  // const editMode = mode === "edit";
  // const navigate = useNavigate();

  // const [formData, setFormData] = useState({
  //   title: editMode ? existingFormData.title || "" : "",
  //   summary: editMode ? existingFormData.summary || "" : "",
  //   content: editMode ? existingFormData.content || "" : "",
  //   status: editMode ? existingFormData.status || "published" : "published",
  // });

  // const { createBlog, isCreatingBlog } = useCreateBlog(() => navigate("/dashboard"));
  // const { updateBlog, isUpdatingBlog } = useUpdateBlog(() => navigate("/dashboard"));

  // const isSubmitting = isCreatingBlog || isUpdatingBlog;

  // const isUnchanged = useMemo(() => {
  //   if (!editMode) return false;
  //   return (
  //     formData.title === (existingFormData.title || "") &&
  //     formData.summary === (existingFormData.summary || "") &&
  //     formData.content === (existingFormData.content || "") &&
  //     formData.status === (existingFormData.status || "published")
  //   );
  // }, [formData, editMode, existingFormData]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (editMode) {
  //     updateBlog({ id: existingFormData.id, formData });
  //   } else {
  //     createBlog(formData);
  //   }
  // };

  // const handleStatusChange = (status) => {
  //   setFormData({ ...formData, status });
  // };

  return (
    <div className="blog-form-page">
      <DashboardHeader/>
      <NewEditBlogForm />
    </div>
  );
};

export default BlogFormPage;
