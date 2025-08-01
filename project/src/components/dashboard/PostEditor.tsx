import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Save,
  Eye,
  Image,
  Tag,
  Upload,
  AlertCircleIcon,
  X,
} from "lucide-react";
import { useBlogContext } from "../../contexts/BlogContext";
import { useAuth } from "../../contexts/AuthContext";
// import useCreateBlog from "../../hooks/blogHooks/useCreateBlog";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/uploadToCloudinary";
import { DotLoader } from "../DotLoader";
import OverlayLoader from "../OverlayLoader";

export default function PostEditor({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [coverImagePublicID, setCoverImagePublicID] = useState<string>("");
  const [originalData, setOriginalData] = useState<any>(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const { useSingleBlog, useCreateBlog, useUpdateBlog } = useBlogContext();
  const { id } = useParams();

  const { mutate: updateBlog } = useUpdateBlog();
  const { mutate: addPost } = useCreateBlog();

  const { data: editingBlog, isPending: isFetchingPost } = useSingleBlog(
    id ?? ""
  );

  const { user } = useAuth();

  useEffect(() => {
    if (mode !== "edit" || !id || isFetchingPost) return;

    if (!editingBlog) {
      toast.error("No post found for editing");
      setTimeout(() => navigate("/dashboard/posts"), 0);
      return;
    }

    const cleanTags = editingBlog.tags || [];

    setOriginalData({
      title: editingBlog.title,
      content: editingBlog.content,
      excerpt: editingBlog.excerpt || "",
      tags: cleanTags,
      coverImage: editingBlog.coverImage || "",
      status: editingBlog.status || "draft",
    });

    setTitle(editingBlog.title);
    setContent(editingBlog.content);
    setExcerpt(editingBlog.excerpt || "");
    setTags(cleanTags);
    setCoverImage(editingBlog.coverImage || "");
    setStatus(editingBlog.status || "draft");
  }, [mode, id, editingBlog, isFetchingPost, navigate]);

  const hasChanged =
    mode === "edit" && originalData
      ? title !== originalData.title ||
        content !== originalData.content ||
        excerpt !== originalData.excerpt ||
        coverImage !== originalData.coverImage ||
        status !== originalData.status ||
        JSON.stringify(tags) !== JSON.stringify(originalData.tags)
      : true; // For create mode, always true

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddCoverImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      toast.error(
        `File is too large. Please upload an image under ${MAX_SIZE_MB}MB.`,
        {
          icon: <AlertCircleIcon className="text-orange-500" />,
        }
      );
      return;
    }

    setUploadingCoverImage(true);

    try {
      const { secureUrl, publicId } = await uploadToCloudinary(file);
      setCoverImage(secureUrl);
      setCoverImagePublicID(publicId);
      toast.success("Image upload successful!");
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
    } finally {
      setUploadingCoverImage(false);
    }
  };

  const handleRemoveCoverImage = async () => {
    try {
      await deleteFromCloudinary(coverImagePublicID);
      setCoverImage("");
      setCoverImagePublicID("");
      toast.success("Cover image removed");
    } catch (error) {
      console.error("Failed to remove cover image:", error);
      toast.error("Failed to remove cover image");
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    const post = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.trim().substring(0, 150) + "...",
      author: user?.fullname || "Anonymous",
      tags,
      readTime: calculateReadTime(content),
      status,
      coverImage: coverImage.trim() || undefined,
      published_at: status === "published" ? new Date().toISOString() : null,
      ...(mode === "create"
        ? { created_at: new Date().toISOString() }
        : { updated_at: new Date().toISOString() }),
    };
    console.log(post);

    if (mode === "create") {
      try {
        addPost(post);
        navigate("/dashboard/posts");
      } catch (error) {
        console.error("Failed to save post:", error);
      } finally {
        setSaving(false);
      }
    }

    if (mode === "edit") {
      if (!id) {
        toast.error("Post ID is required for editing");
        setSaving(false);
        return;
      }
      try {
        updateBlog({ id, post });
        navigate("/dashboard/posts");
      } catch (error) {
        console.error("Failed to update post:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "create" ? "Create New" : "Edit"} Post
          </h1>
          <p className="text-gray-600">Write and publish your blog post</p>
        </div>
      </div>
      {isFetchingPost && <OverlayLoader />}
      <form onSubmit={submitForm} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Post Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter your post title..."
              required
            />
          </div>

          {/* Cover Image */}
          <div>
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium text-gray-700 mb-2"
              aria-disabled={uploadingCoverImage}
            >
              Cover Image URL (optional)
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="url"
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="paste image url (e.g. https://example.com/image.jpg)"
                disabled={uploadingCoverImage}
              />

              {coverImage && (
                <button
                  onClick={handleRemoveCoverImage}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  disabled={uploadingCoverImage}
                >
                  <X className="h-4 w-4" /> Remove Photo
                </button>
              )}
            </div>
            <div className="flex items-center justify-center gap-1 text-md text-gray-500 my-2">
              <hr className="flex-grow" />
              <span>or</span>
              <hr className="flex-grow" />
            </div>
            <div>
              <label
                htmlFor="avatar-upload"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer mb-3"
                aria-disabled={uploadingCoverImage}
              >
                <Upload className="h-4 w-4" />{" "}
                {coverImage
                  ? "Change cover image"
                  : "Upload image (max size 2MB)*"}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAddCoverImage}
                className="hidden"
                disabled={false}
              />
            </div>
            {coverImage && (
              <div className="mt-3">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    toast.error("Invalid image URL");
                    setTimeout(() => {
                      setCoverImage("");
                    }, 3000);
                  }}
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Excerpt (optional)
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of your post..."
            />
            <p className="text-xs text-gray-500">
              {excerpt.length}/300 characters
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag..."
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content*
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Write your post content here... (Supports Markdown)"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Estimated read time: {calculateReadTime(content)} minutes
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === "draft"}
                onChange={(e) => setStatus(e.target.value as "draft")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Save as Draft
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === "published"}
                onChange={(e) => setStatus(e.target.value as "published")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Publish Now
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              type="submit"
              disabled={
                saving ||
                !title.trim() ||
                !content.trim() ||
                (mode === "edit" && !hasChanged)
              }
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving
                ? "Saving..."
                : status === "published"
                ? "Publish"
                : "Save Draft"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
