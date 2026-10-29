import React, { useState } from "react";
import { FloatingMenu, Editor } from "@tiptap/react";
import {
    PlusIcon,
    ImageIcon,
    VideoIcon,
    TableIcon,
    CodeIcon,
    CalloutIcon,
    DividerIcon,
    BulletListIcon,
    OrderedListIcon,
    TaskListIcon,
    WordDocIcon
} from "./Icons";

interface FloatingBlockMenuProps {
    editor: Editor;
    enableImages?: boolean;
    enableMediaEmbeds?: boolean;
    enableTables?: boolean;
    enableCodeBlocks?: boolean;
    enableCallouts?: boolean;
    enableTaskLists?: boolean;
    enableDocxImport?: boolean;
    onTriggerImageUpload: () => void;
    onTriggerVideoEmbed: () => void;
    onTriggerDocxImport?: () => void;
}

export const FloatingBlockMenu: React.FC<FloatingBlockMenuProps> = ({
    editor,
    enableImages = true,
    enableMediaEmbeds = true,
    enableTables = true,
    enableCodeBlocks = true,
    enableCallouts = true,
    enableTaskLists = true,
    enableDocxImport = true,
    onTriggerImageUpload,
    onTriggerVideoEmbed,
    onTriggerDocxImport
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const insertDivider = () => {
        editor.chain().focus().setHorizontalRule().run();
        setIsOpen(false);
    };

    const insertCodeBlock = () => {
        editor.chain().focus().toggleCodeBlock().run();
        setIsOpen(false);
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        setIsOpen(false);
    };

    const insertCallout = () => {
        editor.chain().focus().setCallout({ type: "info" }).run();
        setIsOpen(false);
    };

    const insertBulletList = () => {
        editor.chain().focus().toggleBulletList().run();
        setIsOpen(false);
    };

    const insertOrderedList = () => {
        editor.chain().focus().toggleOrderedList().run();
        setIsOpen(false);
    };

    const insertTaskList = () => {
        editor.chain().focus().toggleTaskList().run();
        setIsOpen(false);
    };

    return (
        <FloatingMenu
            editor={editor}
            tippyOptions={{
                duration: 150,
                placement: "left",
                offset: [-12, 0],
                interactive: true
            }}
            shouldShow={({ state }) => {
                if (isOpen) return true;
                const { selection } = state;
                const { $from, empty } = selection;
                if (!empty) return false;
                const node = $from.parent;
                return node.isTextblock && node.content.size === 0;
            }}
            className="vik-floating-menu-container"
        >
            <div className={`vik-floating-menu ${isOpen ? "is-open" : ""}`}>
                <button
                    type="button"
                    className={`vik-floating-trigger-btn ${isOpen ? "is-active" : ""}`}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setIsOpen(!isOpen)}
                    title={isOpen ? "Close block menu" : "Add a block"}
                >
                    <PlusIcon size={18} />
                </button>

                {isOpen && (
                    <div className="vik-floating-actions-tray">
                        {enableImages && (
                            <button
                                type="button"
                                className="vik-floating-action-btn"
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => {
                                    setIsOpen(false);
                                    onTriggerImageUpload();
                                }}
                                title="Insert Image"
                            >
                                <ImageIcon size={16} />
                                <span>Image</span>
                            </button>
                        )}

                        {enableDocxImport && onTriggerDocxImport && (
                            <button
                                type="button"
                                className="vik-floating-action-btn"
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => {
                                    setIsOpen(false);
                                    onTriggerDocxImport();
                                }}
                                title="Import Word Document (.docx)"
                            >
                                <WordDocIcon size={16} />
                                <span>Word (.docx)</span>
                            </button>
                        )}

                        {enableMediaEmbeds && (
                            <button
                                type="button"
                                className="vik-floating-action-btn"
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => {
                                    setIsOpen(false);
                                    onTriggerVideoEmbed();
                                }}
                                title="Embed Video (YouTube / Vimeo)"
                            >
                                <VideoIcon size={16} />
                                <span>Video</span>
                            </button>
                        )}

                        {enableTables && (
                            <button
                                type="button"
                                className="vik-floating-action-btn"
                                onMouseDown={e => e.preventDefault()}
                                onClick={insertTable}
                                title="Insert 3x3 Table"
                            >
                                <TableIcon size={16} />
                                <span>Table</span>
                            </button>
                        )}

                        {enableCodeBlocks && (
                            <button
                                type="button"
                                className="vik-floating-action-btn"
                                onMouseDown={e => e.preventDefault()}
                                onClick={insertCodeBlock}
                                title="Insert Code Block"
                            >
                                <CodeIcon size={16} />
                                <span>Code</span>
                            </button>
                        )}

                        {enableCallouts && (
                            <button
                                type="button"
                                className="vik-floating-action-btn"
                                onMouseDown={e => e.preventDefault()}
                                onClick={insertCallout}
                                title="Insert Callout Alert"
                            >
                                <CalloutIcon size={16} />
                                <span>Callout</span>
                            </button>
                        )}

                        <button
                            type="button"
                            className="vik-floating-action-btn"
                            onMouseDown={e => e.preventDefault()}
                            onClick={insertBulletList}
                            title="Bulleted List"
                        >
                            <BulletListIcon size={16} />
                            <span>List</span>
                        </button>

                        <button
                            type="button"
                            className="vik-floating-action-btn"
                            onMouseDown={e => e.preventDefault()}
                            onClick={insertOrderedList}
                            title="Numbered List"
                        >
                            <OrderedListIcon size={16} />
                            <span>Numbered</span>
                        </button>

                        {enableTaskLists && (
                            <button
                                type="button"
                                className="vik-floating-action-btn"
                                onMouseDown={e => e.preventDefault()}
                                onClick={insertTaskList}
                                title="Interactive Task List"
                            >
                                <TaskListIcon size={16} />
                                <span>Tasks</span>
                            </button>
                        )}

                        <button
                            type="button"
                            className="vik-floating-action-btn"
                            onMouseDown={e => e.preventDefault()}
                            onClick={insertDivider}
                            title="Divider Line"
                        >
                            <DividerIcon size={16} />
                            <span>Divider</span>
                        </button>
                    </div>
                )}
            </div>
        </FloatingMenu>
    );
};
