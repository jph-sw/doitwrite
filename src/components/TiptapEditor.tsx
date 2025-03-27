import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button"; // Adjust the import path

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: "<p>Hello World!</p>",
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <Button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </Button>
      <div className="prose">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
