import { TextSelection } from "@tiptap/pm/state";
import { Editor } from "@tiptap/core";
import React from "react";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";

// We need to match the actual types from TableOfContentData
interface ToCItemProps {
  item: {
    level: number; // Number from the TableOfContentData
    isActive: boolean;
    isScrolledOver: boolean;
    id: string;
    itemIndex: number;
    textContent: string;
  };
  onItemClick: (e: React.MouseEvent, id: string) => void;
}

// Define custom CSS properties interface
interface CustomCSSProperties extends React.CSSProperties {
  "--level": string; // CSS variables are always strings
}

export const ToCItem = ({ item, onItemClick }: ToCItemProps) => {
  // Create style object with the custom property - convert number to string
  const style = {
    "--level": String(item.level),
  } as CustomCSSProperties;

  return (
    <div
      className={`${item.isActive && !item.isScrolledOver ? "is-active" : ""} ${item.isScrolledOver ? "is-scrolled-over" : ""}`}
      style={style}
    >
      <a
        href={`#${item.id}`}
        onClick={(e) => onItemClick(e, item.id)}
        data-item-index={item.itemIndex}
      >
        {item.textContent}
      </a>
    </div>
  );
};

export const ToCEmptyState = () => {
  return (
    <div className="empty-state">
      <p>Start editing your document to see the outline.</p>
    </div>
  );
};

interface ToCProps {
  items?: TableOfContentData; // Use the proper type from the extension
  editor: Editor | null;
}

export const ToC = ({ items = [], editor }: ToCProps) => {
  if (items.length === 0) {
    return <ToCEmptyState />;
  }

  const onItemClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"]`);
      if (!element) return;

      const pos = editor.view.posAtDOM(element, 0);

      // set focus
      const tr = editor.view.state.tr;

      tr.setSelection(new TextSelection(tr.doc.resolve(pos)));

      editor.view.dispatch(tr);

      editor.view.focus();

      if (history.pushState) {
        // eslint-disable-line
        history.pushState(null, "", `#${id}`); // eslint-disable-line
      }

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {items.map((item) => (
        <ToCItem onItemClick={onItemClick} key={item.id} item={item} />
      ))}
    </>
  );
};
