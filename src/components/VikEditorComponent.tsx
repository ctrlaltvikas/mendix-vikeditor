import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

import { CalloutExtension } from "./CalloutExtension";
import { BubbleToolbar } from "./BubbleToolbar";
import { FloatingBlockMenu } from "./FloatingBlockMenu";
import { createSlashCommandsExtension } from "./SlashCommands";
import { TableMenu } from "./TableMenu";
import { MediaDialog, MediaDialogType } from "./MediaDialog";
import { ReadingStats } from "./ReadingStats";
import { ThemePresetEnum, ImageUploadModeEnum } from "../../typings/VikEditorProps";

// Initialize syntax highlighter
const lowlight = createLowlight(common);

export interface VikEditorComponentProps {
    value: string;
    onChange: (html: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    readOnly?: boolean;
    themePreset?: ThemePresetEnum;
    maxWidth?: string;
    minHeight?: string;
    enableBubbleMenu?: boolean;
    enableFloatingMenu?: boolean;
    enableSlashCommands?: boolean;
    enableCodeBlocks?: boolean;
    enableTables?: boolean;
    enableCallouts?: boolean;
    enableTaskLists?: boolean;
    enableMediaEmbeds?: boolean;
    enableImages?: boolean;
    enableReadingStats?: boolean;
    imageUploadMode?: ImageUploadModeEnum;
    onTriggerMendixUpload?: () => void;
    className?: string;
}

export const VikEditorComponent: React.FC<VikEditorComponentProps> = ({
    value,
    onChange,
    onBlur,
    placeholder = "Tell your story, or type '/' for commands...",
    readOnly = false,
    themePreset = "mediumSerif",
    maxWidth = "740px",
    minHeight = "320px",
    enableBubbleMenu = true,
    enableFloatingMenu = true,
    enableSlashCommands = true,
    enableCodeBlocks = true,
    enableTables = true,
    enableCallouts = true,
    enableTaskLists = true,
    enableMediaEmbeds = true,
    enableImages = true,
    enableReadingStats = true,
    imageUploadMode = "base64",
    onTriggerMendixUpload,
    className = ""
}) => {
    const [mediaDialogType, setMediaDialogType] = useState<MediaDialogType>(null);

    const openImageDialog = useCallback(() => {
        setMediaDialogType("image");
    }, []);

    const openVideoDialog = useCallback(() => {
        setMediaDialogType("video");
    }, []);

    const closeMediaDialog = useCallback(() => {
        setMediaDialogType(null);
    }, []);

    // Build extensions conditionally
    const extensions = useMemo(() => {
        const extList: any[] = [
            StarterKit.configure({
                codeBlock: false,
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: {
                    class: "vik-link",
                    target: "_blank",
                    rel: "noopener noreferrer"
                }
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === "heading") {
                        return "Heading...";
                    }
                    return placeholder;
                }
            }),
            CharacterCount
        ];

        if (enableCodeBlocks) {
            extList.push(
                CodeBlockLowlight.configure({
                    lowlight,
                    HTMLAttributes: {
                        class: "vik-code-block"
                    }
                })
            );
        }

        if (enableTables) {
            extList.push(
                Table.configure({
                    resizable: true,
                    HTMLAttributes: {
                        class: "vik-table"
                    }
                }),
                TableRow,
                TableHeader,
                TableCell
            );
        }

        if (enableTaskLists) {
            extList.push(
                TaskList.configure({
                    HTMLAttributes: {
                        class: "vik-task-list"
                    }
                }),
                TaskItem.configure({
                    nested: true,
                    HTMLAttributes: {
                        class: "vik-task-item"
                    }
                })
            );
        }

        if (enableImages) {
            extList.push(
                Image.configure({
                    inline: false,
                    allowBase64: true,
                    HTMLAttributes: {
                        class: "vik-image"
                    }
                })
            );
        }

        if (enableMediaEmbeds) {
            extList.push(
                Youtube.configure({
                    inline: false,
                    width: 640,
                    height: 360,
                    HTMLAttributes: {
                        class: "vik-video-embed"
                    }
                })
            );
        }

        if (enableCallouts) {
            extList.push(CalloutExtension);
        }

        if (enableSlashCommands) {
            extList.push(
                createSlashCommandsExtension({
                    enableImages,
                    enableMediaEmbeds,
                    enableTables,
                    enableCodeBlocks,
                    enableCallouts,
                    enableTaskLists,
                    onTriggerImageUpload: openImageDialog,
                    onTriggerVideoEmbed: openVideoDialog
                })
            );
        }

        return extList;
    }, [
        placeholder,
        enableCodeBlocks,
        enableTables,
        enableTaskLists,
        enableImages,
        enableMediaEmbeds,
        enableCallouts,
        enableSlashCommands,
        openImageDialog,
        openVideoDialog
    ]);

    const editor = useEditor({
        extensions,
        content: value,
        editable: !readOnly,
        onUpdate: ({ editor: currentEditor }) => {
            const html = currentEditor.getHTML();
            onChange(html);
        },
        onBlur: () => {
            if (onBlur) {
                onBlur();
            }
        }
    });

    // Synchronize incoming value changes if different from internal state
    useEffect(() => {
        if (!editor) {
            return;
        }

        const currentHtml = editor.getHTML();
        if (value !== currentHtml && !editor.isFocused) {
            editor.commands.setContent(value, false);
        }
    }, [value, editor]);

    // Synchronize readOnly state
    useEffect(() => {
        if (editor) {
            editor.setEditable(!readOnly);
        }
    }, [readOnly, editor]);

    const handleInsertImage = useCallback(
        (src: string, alt?: string) => {
            if (editor) {
                editor.chain().focus().setImage({ src, alt: alt || "" }).run();
            }
        },
        [editor]
    );

    const handleInsertVideo = useCallback(
        (url: string) => {
            if (editor) {
                editor.chain().focus().setYoutubeVideo({ src: url }).run();
            }
        },
        [editor]
    );

    const themeClass = `vik-theme-${themePreset}`;

    return (
        <div
            className={`vik-editor-root ${themeClass} ${readOnly ? "is-readonly" : ""} ${className}`}
            style={{ maxWidth, minHeight }}
        >
            {editor && !readOnly && enableBubbleMenu && (
                <BubbleToolbar editor={editor} enableCallouts={enableCallouts} />
            )}

            {editor && !readOnly && enableFloatingMenu && (
                <FloatingBlockMenu
                    editor={editor}
                    enableImages={enableImages}
                    enableMediaEmbeds={enableMediaEmbeds}
                    enableTables={enableTables}
                    enableCodeBlocks={enableCodeBlocks}
                    enableCallouts={enableCallouts}
                    enableTaskLists={enableTaskLists}
                    onTriggerImageUpload={openImageDialog}
                    onTriggerVideoEmbed={openVideoDialog}
                />
            )}

            {editor && !readOnly && enableTables && <TableMenu editor={editor} />}

            <div className="vik-editor-canvas" style={{ minHeight }}>
                <EditorContent editor={editor} />
            </div>

            {editor && enableReadingStats && (
                <div className="vik-editor-footer">
                    <ReadingStats editor={editor} />
                </div>
            )}

            <MediaDialog
                type={mediaDialogType}
                uploadMode={imageUploadMode}
                isOpen={mediaDialogType !== null}
                onClose={closeMediaDialog}
                onInsertImage={handleInsertImage}
                onInsertVideo={handleInsertVideo}
                onTriggerMendixUpload={onTriggerMendixUpload}
            />
        </div>
    );
};
