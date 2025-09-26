import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  Eye,
  Image,
  Tag,
  Upload,
  AlertCircleIcon,
  X,
  Bookmark,
  Share2,
  Clock,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
// import Highlight from '@tiptap/extension-high

import { useBlogContext } from "../../contexts/BlogContext";
import { useAuth } from "../../contexts/AuthContext";
import { BlogPost } from "../../types/types";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/uploadToCloudinary";

import useCreateBlog from "../../hooks/blogHooks/useCreateBlog";
import useSingleBlog from "../../hooks/blogHooks/useSingleBlog";

import OverlayLoader from "../OverlayLoader";
import Tiptap from "./editor-components/Tiptap";
import { stripHtml } from "../../utils/stripHtml";
import { clear } from "console";
import { useDisclosure } from "@mantine/hooks";
import { Avatar, Modal } from "@mantine/core";

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

  const [hasCheckedImage, setHasCheckedImage] = useState(false);

  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const { useUpdateBlog } = useBlogContext();
  const { id } = useParams();

  const { mutate: updateBlog } = useUpdateBlog();
  const { addPost } = useCreateBlog();

  const { data: editingBlog, isPending: isFetchingPost } = useSingleBlog(
    id ?? ""
  );

  const { user } = useAuth();

  useEffect(() => {
    if (mode === "edit") {
      if (!id || isFetchingPost) return;

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
    } else {
      // Reset form for create mode
      setOriginalData(null);
      setTitle("");
      setContent("");
      setExcerpt("");
      setTags([]);
      setCoverImage("");
      setStatus("draft");
    }
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
    if (!newTag.trim()) return;

    // Split by comma OR by #, filter out empties, and trim spaces
    const newTags = newTag
      .split(/[# ,]+/) // split on #, comma, or space
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Add only unique ones that aren’t already in tags
    const uniqueTags = newTags.filter((tag) => !tags.includes(tag));

    if (uniqueTags.length > 0) {
      setTags([...tags, ...uniqueTags]);
    }
    setNewTag("");
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

    // Show loading toast and keep its id
    const toastId = toast.loading("Uploading image...");

    try {
      const res = await uploadToCloudinary(file);
      const { secure_url: secureUrl, public_id: publicId } = res;

      setCoverImage(secureUrl);
      setCoverImagePublicID(publicId);

      // Update the same toast
      toast.success("Image upload successful!", { id: toastId });
    } catch (err) {
      // Update the same toast
      toast.error("Upload failed", { id: toastId });
      console.error(err);
    } finally {
      setUploadingCoverImage(false);
    }
  };

  const handleRemoveCoverImage = async () => {
    try {
      if (coverImagePublicID) await deleteFromCloudinary(coverImagePublicID);
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

  const post = {
      title: title.trim(),
      content: content.trim(),
      excerpt:
        excerpt.trim() || stripHtml(content).trim().substring(0, 150) + "...",
      author: user?.fullname || "Anonymous",
      tags,
      readTime: calculateReadTime(content),
      status,
      coverImage: coverImage.trim() || "",
      published_at: status === "published" ? new Date().toISOString() : null,
      ...(mode === "create"
        ? { created_at: new Date().toISOString() }
        : { updated_at: new Date().toISOString() }),
    };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    

    const updatedFields: Partial<BlogPost> = {};

    if (mode === "edit") {
      if (title !== originalData.title) updatedFields.title = title.trim();
      if (content !== originalData.content)
        updatedFields.content = content.trim();
      if (excerpt !== originalData.excerpt)
        updatedFields.excerpt = excerpt.trim();
      if (coverImage !== originalData.coverImage)
        updatedFields.coverImage = coverImage.trim();
      if (status !== originalData.status) updatedFields.status = status;
      if (JSON.stringify(tags) !== JSON.stringify(originalData.tags))
        updatedFields.tags = tags;
      if (calculateReadTime(content) !== Number(originalData.readTime))
        updatedFields.readTime = calculateReadTime(content);

      updatedFields.updated_at = new Date().toISOString();
      if (status === "published") {
        updatedFields.published_at = new Date().toISOString();
      }
    }

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
        updateBlog({ id, post: updatedFields });
        navigate("/dashboard/posts");
        // console.log("Updated fields:", updatedFields);
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
      {mode === "edit" && isFetchingPost && <OverlayLoader />}
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
                  type="button"
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
                    setSaving(true);
                    setTimeout(() => {
                      setCoverImage("");
                      setSaving(false);
                    }, 100);
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
            {/* <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Write your post content here... (Supports Markdown)"
              required
            /> */}
            <Tiptap content={content} setContent={setContent} />
            <p className="text-sm text-gray-500 mt-2">
              Estimated read time: {calculateReadTime(content)} minutes
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row md:items-center sm:justify-between bg-white rounded-lg shadow-sm border p-4 gap-4 md:gap-0">
          {/* Radio Status Options */}
          <div className="flex my-2 gap-6 justify-center sm:justify-start sm:my-0 sm:gap-4">
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

          <Modal opened={opened} onClose={close} title="Post Preview" size="auto" centered>
            <article className="max-w-4xl mx-auto px-4 py-8">

              {post.coverImage && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border p-8">
                <header className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                  </h1>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {/* <img
                        src={post.author_avatar?.url || defaultAvatar}
                        alt={post.author}
                        className="w-12 h-12 rounded-full object-cover"
                      /> */}
                      <Avatar/>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {post.author}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.published_at &&
                              new Date(post.published_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime} min read
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </header>

                <div
                  className="prose prose-lg max-w-none leading-8"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
              </div>
            </article>
          </Modal>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={open}
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
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving
                ? "Saving..."
                : status === "published"
                ? mode === "create"
                  ? "Publish"
                  : "Update"
                : "Save Draft"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
