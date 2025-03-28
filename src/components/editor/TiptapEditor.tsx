import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button"; // Adjust the import path
import TableOfContents, {
  getHierarchicalIndexes,
  TableOfContentData,
} from "@tiptap-pro/extension-table-of-contents";
import { ToC } from "./toc";

const MemorizedToC = React.memo(ToC);

const TiptapEditor = () => {
  const [items, setItems] = useState<TableOfContentData>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setItems(content);
        },
      }),
    ],
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
        <MemorizedToC editor={editor} items={items} />
      </div>
    </div>
  );
};

export default TiptapEditor;
