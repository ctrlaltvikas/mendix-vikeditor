import React, { useState, useCallback } from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikeIcon,
    CodeIcon,
    LinkIcon,
    UnlinkIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    QuoteIcon,
    CalloutIcon,
    CheckIcon,
    CloseIcon
} from "./Icons";

interface BubbleToolbarProps {
    editor: Editor;
    enableCallouts?: boolean;
}

export const BubbleToolbar: React.FC<BubbleToolbarProps> = ({ editor, enableCallouts = true }) => {
    const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    const openLinkInput = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href || "";
        setLinkUrl(previousUrl);
        setIsLinkInputOpen(true);
    }, [editor]);

    const setLink = useCallback(() => {
        if (!linkUrl.trim()) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            const formattedUrl = linkUrl.match(/^https?:\/\//i) ? linkUrl : `https://${linkUrl}`;
            editor.chain().focus().extendMarkRange("link").setLink({ href: formattedUrl, target: "_blank" }).run();
        }
        setIsLinkInputOpen(false);
        setLinkUrl("");
    }, [editor, linkUrl]);

    const removeLink = useCallback(() => {
        editor.chain().focus().unsetLink().run();
        setIsLinkInputOpen(false);
        setLinkUrl("");
    }, [editor]);

    const shouldShow = useCallback(() => {
        // Only show if editor is editable, has selection, and is not a node selection (like image or table)
        if (!editor.isEditable) {
            return false;
        }
        const { state } = editor;
        const { selection } = state;
        const { empty } = selection;
        if (empty) {
            return false;
        }
        // Don't show inside code block
        if (editor.isActive("codeBlock")) {
            return false;
        }
        return true;
    }, [editor]);

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{
                duration: 150,
                animation: "shift-away",
                placement: "top",
                offset: [0, 10]
            }}
            shouldShow={shouldShow}
            className="vik-bubble-menu"
        >
            {isLinkInputOpen ? (
                <div className="vik-bubble-link-input-group">
                    <input
                        type="url"
                        className="vik-bubble-link-input"
                        placeholder="Paste or type a link..."
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                setLink();
                            } else if (e.key === "Escape") {
                                setIsLinkInputOpen(false);
                            }
                        }}
                        autoFocus
                    />
                    <button
                        type="button"
                        className="vik-bubble-btn vik-bubble-btn-apply"
                        onClick={setLink}
                        title="Apply Link"
                    >
                        <CheckIcon size={14} />
                    </button>
                    {editor.isActive("link") && (
                        <button
                            type="button"
                            className="vik-bubble-btn vik-bubble-btn-remove"
                            onClick={removeLink}
                            title="Remove Link"
                        >
                            <UnlinkIcon size={14} />
                        </button>
                    )}
                    <button
                        type="button"
                        className="vik-bubble-btn"
                        onClick={() => setIsLinkInputOpen(false)}
                        title="Cancel"
                    >
                        <CloseIcon size={14} />
                    </button>
                </div>
            ) : (
                <div className="vik-bubble-btn-row">
                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("bold") ? "is-active" : ""}`}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        title="Bold (Ctrl+B)"
                    >
                        <BoldIcon size={15} />
                    </button>
                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("italic") ? "is-active" : ""}`}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        title="Italic (Ctrl+I)"
                    >
                        <ItalicIcon size={15} />
                    </button>
                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("underline") ? "is-active" : ""}`}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon size={15} />
                    </button>
                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("strike") ? "is-active" : ""}`}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        title="Strikethrough"
                    >
                        <StrikeIcon size={15} />
                    </button>
                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("code") ? "is-active" : ""}`}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        title="Inline Code"
                    >
                        <CodeIcon size={15} />
                    </button>

                    <span className="vik-bubble-divider" />

                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("link") ? "is-active" : ""}`}
                        onClick={openLinkInput}
                        title="Add / Edit Link"
                    >
                        <LinkIcon size={15} />
                    </button>

                    <span className="vik-bubble-divider" />

                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("heading", { level: 1 }) ? "is-active" : ""}`}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        title="Heading 1"
                    >
                        <Heading1Icon size={15} />
                    </button>
                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("heading", { level: 2 }) ? "is-active" : ""}`}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        title="Heading 2"
                    >
                        <Heading2Icon size={15} />
                    </button>
                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("heading", { level: 3 }) ? "is-active" : ""}`}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        title="Heading 3"
                    >
                        <Heading3Icon size={15} />
                    </button>
                    <button
                        type="button"
                        className={`vik-bubble-btn ${editor.isActive("blockquote") ? "is-active" : ""}`}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        title="Quote"
                    >
                        <QuoteIcon size={15} />
                    </button>

                    {enableCallouts && (
                        <button
                            type="button"
                            className={`vik-bubble-btn ${editor.isActive("callout") ? "is-active" : ""}`}
                            onClick={() => editor.chain().focus().toggleCallout({ type: "info" }).run()}
                            title="Callout Box"
                        >
                            <CalloutIcon size={15} />
                        </button>
                    )}
                </div>
            )}
        </BubbleMenu>
    );
};
