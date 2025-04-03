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
import {
  enableKeyboardNavigation,
  Slash,
  SlashCmd,
  SlashCmdProvider,
} from "@harshtalks/slash-tiptap";
import { suggestions } from "./suggestion/suggestion";

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
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v),
      },
      attributes: {
        class:
          "focus:outline-none py-2 w-full prose dark:prose-invert max-w-full",
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
      Slash.configure({
        suggestion: {
          items: () => suggestions,
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
        <SlashCmdProvider>
          <EditorContent editor={editor} className="w-3/4" />
          <SlashCmd.Root editor={editor}>
            <SlashCmd.Cmd>
              <SlashCmd.Empty>None</SlashCmd.Empty>
              <SlashCmd.List className="bg-secondary p-0.5 rounded-lg space-y-2">
                {suggestions.map((item) => (
                  <SlashCmd.Item
                    className="px-1 rounded-md space-x-2 aria-selected:bg-background"
                    value={item.title}
                    onCommand={(val) => {
                      item.command(val);
                    }}
                    key={item.title}
                  >
                    <p>{item.title}</p>
                  </SlashCmd.Item>
                ))}
              </SlashCmd.List>
            </SlashCmd.Cmd>
          </SlashCmd.Root>
        </SlashCmdProvider>
        <MemorizedToC editor={editor} items={items} />
      </div>
    </div>
  );
};

export default TiptapEditor;
