// src/Toolbar.tsx
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  ImagePlus,
  Link as LinkIcon,
} from "lucide-react";
import React from "react";
import type { Level } from "@tiptap/extension-heading";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      type="button" // <-- prevents form submission
      {...props} // <-- spread the rest (onClick, className, disabled, etc.)
    >
      {children}
    </button>
  );
};

interface ToolbarProps {
  editor: Editor | null;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) {
    return null;
  }

  const commonClasses = "p-2 rounded hover:bg-gray-200 transition-colors";
  const activeClasses = "bg-gray-300 text-blue-600";
  const inactiveClasses = "text-gray-600";

  const headerSelectOptions = [
    { value: "paragraph", label: "Paragraph" },
    { value: "1", label: "Heading 1" },
    { value: "2", label: "Heading 2" },
    { value: "3", label: "Heading 3" },
    { value: "4", label: "Heading 4" },
    { value: "5", label: "Heading 5" },
    { value: "6", label: "Heading 6" },
  ]

  return (
    <div className="flex items-center flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50 rounded-t-lg">
      {/* Text Formatting Group */}
      <div className="flex gap-1">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${commonClasses} ${
            editor.isActive("bold") ? activeClasses : inactiveClasses
          }`}
        >
          <Bold size={18} />
        </Button>

        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`${commonClasses} ${
            editor.isActive("italic") ? activeClasses : inactiveClasses
          }`}
        >
          <Italic size={18} />
        </Button>

        {/* New Underline button */}
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`${commonClasses} ${
            editor.isActive("underline") ? activeClasses : inactiveClasses
          }`}
        >
          <Underline size={18} />
        </Button>

        {/* New Strike button */}
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`${commonClasses} ${
            editor.isActive("strike") ? activeClasses : inactiveClasses
          }`}
        >
          <Strikethrough size={18} />
        </Button>

        {/* New Code (inline) button */}
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`${commonClasses} ${
            editor.isActive("code") ? activeClasses : inactiveClasses
          }`}
        >
          <Code size={18} />
        </Button>
      </div>

      <div className="h-6 w-px bg-gray-200 mx-1" />

      {/* Block Elements Group */}
      <div className="flex gap-1">
        <select
          onChange={(e) =>{
            if(e.target.value === "paragraph") {
              editor.chain().focus().setParagraph().run();
            }else{
              editor
              .chain()
              .focus()
              .toggleHeading({ level: parseInt(e.target.value) as Level })
              .run()
            }
          }}
          value={
            [1, 2, 3, 4, 5, 6].find((lvl) =>
              editor.isActive("heading", { level: lvl })
            ) || "paragraph"
          }
          className="border rounded px-2 py-1 text-sm cursor-pointer"
        >
          {headerSelectOptions.map((option) => (
            <option key={option.value} value={option.value} className="cursor-pointer">
              {option.label}
            </option>
          ))}
        </select>

        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${commonClasses} ${
            editor.isActive("bulletList") ? activeClasses : inactiveClasses
          }`}
        >
          <List size={18} />
        </Button>

        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${commonClasses} ${
            editor.isActive("orderedList") ? activeClasses : inactiveClasses
          }`}
        >
          <ListOrdered size={18} />
        </Button>

        {/* New Blockquote button */}
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          className={`${commonClasses} ${
            editor.isActive("blockquote") ? activeClasses : inactiveClasses
          }`}
        >
          <Quote size={18} />
        </Button>
      </div>

      <div className="h-6 w-px bg-gray-200 mx-1" />

      <div className="flex gap-1">
        {/* New Image button */}
        <Button
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className={`${commonClasses} ${inactiveClasses}`}
        >
          <ImagePlus size={18} />
        </Button>

        {/* New Link button */}
        <Button
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`${commonClasses} ${inactiveClasses}`}
        >
          <LinkIcon size={18} />
        </Button>
      </div>

      <div className="h-6 w-px bg-gray-200 mx-1" />

      {/* Alignment Group */}
      <div className="flex gap-1">
        <Button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`${commonClasses} ${
            editor.isActive({ textAlign: "left" })
              ? activeClasses
              : inactiveClasses
          }`}
        >
          <AlignLeft size={18} />
        </Button>

        <Button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`${commonClasses} ${
            editor.isActive({ textAlign: "center" })
              ? activeClasses
              : inactiveClasses
          }`}
        >
          <AlignCenter size={18} />
        </Button>

        <Button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`${commonClasses} ${
            editor.isActive({ textAlign: "right" })
              ? activeClasses
              : inactiveClasses
          }`}
        >
          <AlignRight size={18} />
        </Button>
      </div>

      <div className="h-6 w-px bg-gray-200 mx-1" />

      {/* History Group */}
      <div className="flex gap-1">
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={`${commonClasses} ${inactiveClasses}`}
        >
          <Undo size={18} />
        </Button>

        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={`${commonClasses} ${inactiveClasses}`}
        >
          <Redo size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
