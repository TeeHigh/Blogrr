import { useState, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Editor } from "@tinymce/tinymce-react";

import useCreateBlog from "../hooks/useCreateBlog";
import useUpdateBlog from "../hooks/useUpdateBlog";

import "../styles/NewEditBlog.scss";

const NewEditBlogForm = ({ mode = "create", closeModal, existingFormData = {} }) => {
  const editMode = mode === "edit";

  const [formData, setFormData] = useState({
    title: editMode ? existingFormData.title || "" : "",
    summary: editMode ? existingFormData.summary || "" : "",
    content: editMode ? existingFormData.content || "" : "",
  });

  const { createBlog, isCreatingBlog } = useCreateBlog(closeModal, resetForm);
  const { updateBlog, isUpdatingBlog } = useUpdateBlog(closeModal, resetForm);

  const isSubmitting = isCreatingBlog || isUpdatingBlog;

  function resetForm() {
    setFormData({
      title: "",
      summary: "",
      content: "",
    });
  }

  // Memoized check for unchanged data in edit mode
  const isUnchanged = useMemo(() => {
    if (!editMode) return false;
    return (
      formData.title === (existingFormData.title || "") &&
      formData.summary === (existingFormData.summary || "") &&
      formData.content === (existingFormData.content || "")
    );
  }, [formData, editMode, existingFormData]);

  function handleSubmit(e) {
    e.preventDefault();
    editMode
      ? updateBlog({ id: existingFormData.id, formData })
      : createBlog(formData);
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "align",
  ];

  return (
    <div className="new-edit-blog-modal-content">
      <h1 className="new-edit-blog__title">
        {mode === "create" ? "Create" : "Edit"} Blog
      </h1>
      <form className="new-edit-blog__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="new-edit-blog__input"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Summary"
          className="new-edit-blog__input new-edit-blog__summary"
          type="text"
          maxLength={300}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
        />
        {/* <ReactQuill
          value={formData.content}
          placeholder="Write your blog content here..."
          onChange={(value) =>
            setFormData({ ...formData, content: value })
          }
          className="new-edit-blog__quill"
          modules={modules}
          formats={formats}
        /> */}

        <Editor
          apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
          value={formData.content}
          onEditorChange={(value) =>
            setFormData({ ...formData, content: value })
          }
          init={{
            height: 400,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help",
          }}
        />

        <button
          type="submit"
          className="new-edit-blog__save"
          disabled={isSubmitting || (editMode && isUnchanged)}
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </button>
      </form>
    </div>
  );
};

export default NewEditBlogForm;
