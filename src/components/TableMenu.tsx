import React from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import { TableIcon, TrashIcon, PlusIcon } from "./Icons";

interface TableMenuProps {
    editor: Editor;
}

export const TableMenu: React.FC<TableMenuProps> = ({ editor }) => {
    const shouldShow = () => {
        return editor.isEditable && editor.isActive("table");
    };

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{
                duration: 150,
                placement: "top",
                offset: [0, 8],
                interactive: true
            }}
            shouldShow={shouldShow}
            className="vik-table-menu"
        >
            <div className="vik-table-menu-content">
                <span className="vik-table-menu-label">
                    <TableIcon size={14} />
                    <span>Table</span>
                </span>

                <span className="vik-table-menu-divider" />

                <button
                    type="button"
                    className="vik-table-btn"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    title="Add Row Below"
                >
                    + Row
                </button>
                <button
                    type="button"
                    className="vik-table-btn"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    title="Delete Current Row"
                >
                    - Row
                </button>

                <span className="vik-table-menu-divider" />

                <button
                    type="button"
                    className="vik-table-btn"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    title="Add Column Right"
                >
                    + Col
                </button>
                <button
                    type="button"
                    className="vik-table-btn"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    title="Delete Current Column"
                >
                    - Col
                </button>

                <span className="vik-table-menu-divider" />

                <button
                    type="button"
                    className="vik-table-btn"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                    title="Toggle Header Row"
                >
                    Header
                </button>

                <button
                    type="button"
                    className="vik-table-btn vik-table-btn-danger"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    title="Delete Table"
                >
                    <TrashIcon size={13} />
                </button>
            </div>
        </BubbleMenu>
    );
};
