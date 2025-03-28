import React, { useState } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button"; // Adjust the import path
import TableOfContents, {
  getHierarchicalIndexes,
  TableOfContentData,
} from "@tiptap-pro/extension-table-of-contents";
import { ToC } from "./toc";
import { Bold, Italic } from "lucide-react";

const MemorizedToC = React.memo(ToC);

const TiptapEditor = ({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
}) => {
  const [items, setItems] = useState<TableOfContentData>();

  const editor = useEditor({
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none px-12 py-2 w-full prose dark:prose-invert max-w-full",
      },
    },
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
    content: defaultValue,
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="w-full flex">
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bg-card p-0.5 border flex gap-1 rounded-lg">
            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic />
            </Button>
            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold />
            </Button>
          </div>
        </BubbleMenu>
        <EditorContent editor={editor} className="w-3/4" />
        <MemorizedToC editor={editor} items={items} />
      </div>
    </div>
  );
};

export default TiptapEditor;
