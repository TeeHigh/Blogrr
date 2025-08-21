// src/Tiptap.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

// Import the new extensions
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";

import Toolbar from "./Toolbar";
// import { Placeholder } from "@tiptap/extension-placeholder";

type TiptapProps = {
  content?: string;
  setContent: (content: string) => void;
}

const Tiptap = ({content, setContent}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6 my-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-6 my-2",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "my-2",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-gray-100 p-4 rounded-md text-sm",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-gray-300 pl-4 italic text-gray-600",
          },
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: "font-bold",
          },
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    onUpdate: ({ editor }) => {
      console.log("Editor content updated:", editor);
      const content = editor.getHTML();
      setContent(content);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none",
      },
    },
    content: content ?? "",
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent
        className="w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[25rem] overflow-y-auto"
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;