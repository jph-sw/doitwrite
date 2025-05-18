// src/Tiptap.tsx
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

// define your extension array
const extensions = [StarterKit];

export function TipTapEditor({
  disabled,
  defaultValue,
  onChange,
}: {
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const editor = useEditor({
    extensions,
    content: defaultValue || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm m-0 focus:outline-none h-96",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    editor?.setOptions({ editable: !disabled || false });

    if (!disabled) {
      editor?.commands.focus("end");
    }
  }, [disabled, editor]);

  return (
    <>
      <EditorContent editor={editor} />
      {/* <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} /> */
      /* <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} /> */}
    </>
  );
}
