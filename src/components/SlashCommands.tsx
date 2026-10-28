import React from "react";
import { Extension } from "@tiptap/core";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import { SlashCommandList, CommandItem, SlashCommandListRef } from "./SlashCommandList";
import {
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    BulletListIcon,
    OrderedListIcon,
    TaskListIcon,
    QuoteIcon,
    CodeIcon,
    CalloutIcon,
    TableIcon,
    ImageIcon,
    VideoIcon,
    DividerIcon
} from "./Icons";

export interface SlashCommandsOptions {
    suggestion: Partial<SuggestionOptions>;
    enableImages?: boolean;
    enableMediaEmbeds?: boolean;
    enableTables?: boolean;
    enableCodeBlocks?: boolean;
    enableCallouts?: boolean;
    enableTaskLists?: boolean;
    onTriggerImageUpload?: () => void;
    onTriggerVideoEmbed?: () => void;
}

export const getSuggestionItems = (
    query: string,
    options: {
        enableImages?: boolean;
        enableMediaEmbeds?: boolean;
        enableTables?: boolean;
        enableCodeBlocks?: boolean;
        enableCallouts?: boolean;
        enableTaskLists?: boolean;
        onTriggerImageUpload?: () => void;
        onTriggerVideoEmbed?: () => void;
    }
): CommandItem[] => {
    const items: CommandItem[] = [
        {
            title: "Heading 1",
            description: "Big section heading",
            icon: <Heading1Icon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
            }
        },
        {
            title: "Heading 2",
            description: "Medium section heading",
            icon: <Heading2Icon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
            }
        },
        {
            title: "Heading 3",
            description: "Small section subtitle",
            icon: <Heading3Icon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
            }
        },
        {
            title: "Bullet List",
            description: "Create a simple bulleted list",
            icon: <BulletListIcon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            }
        },
        {
            title: "Numbered List",
            description: "Create a list with numbering",
            icon: <OrderedListIcon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            }
        }
    ];

    if (options.enableTaskLists) {
        items.push({
            title: "Task List",
            description: "Track to-do checkable items",
            icon: <TaskListIcon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
            }
        });
    }

    items.push({
        title: "Quote",
        description: "Capture a standout quote or thought",
        icon: <QuoteIcon size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        }
    });

    if (options.enableCodeBlocks) {
        items.push({
            title: "Code Block",
            description: "Code snippet with syntax highlighting",
            icon: <CodeIcon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
            }
        });
    }

    if (options.enableCallouts) {
        items.push({
            title: "Callout",
            description: "Highlighted tip, info, or warning box",
            icon: <CalloutIcon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setCallout({ type: "info" }).run();
            }
        });
    }

    if (options.enableTables) {
        items.push({
            title: "Table",
            description: "Insert a 3x3 responsive table",
            icon: <TableIcon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
            }
        });
    }

    if (options.enableImages && options.onTriggerImageUpload) {
        items.push({
            title: "Image",
            description: "Upload an image or paste link",
            icon: <ImageIcon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).run();
                options.onTriggerImageUpload!();
            }
        });
    }

    if (options.enableMediaEmbeds && options.onTriggerVideoEmbed) {
        items.push({
            title: "Video Embed",
            description: "Embed YouTube or Vimeo video via URL",
            icon: <VideoIcon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).run();
                options.onTriggerVideoEmbed!();
            }
        });
    }

    items.push({
        title: "Divider",
        description: "Visually separate sections",
        icon: <DividerIcon size={18} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        }
    });

    return items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()));
};

export const createSlashCommandsExtension = (options: {
    enableImages?: boolean;
    enableMediaEmbeds?: boolean;
    enableTables?: boolean;
    enableCodeBlocks?: boolean;
    enableCallouts?: boolean;
    enableTaskLists?: boolean;
    onTriggerImageUpload?: () => void;
    onTriggerVideoEmbed?: () => void;
}) => {
    return Extension.create<SlashCommandsOptions>({
        name: "slashCommands",

        addOptions() {
            return {
                suggestion: {
                    char: "/",
                    command: ({ editor, range, props }) => {
                        props.command({ editor, range });
                    }
                },
                ...options
            };
        },

        addProseMirrorPlugins() {
            return [
                Suggestion({
                    editor: this.editor,
                    char: "/",
                    items: ({ query }) => getSuggestionItems(query, options),
                    render: () => {
                        let component: ReactRenderer<SlashCommandListRef>;
                        let popup: TippyInstance[];

                        return {
                            onStart: props => {
                                component = new ReactRenderer(SlashCommandList, {
                                    props: {
                                        items: props.items,
                                        command: (item: CommandItem) => {
                                            props.command(item);
                                        }
                                    },
                                    editor: props.editor
                                });

                                if (!props.clientRect) {
                                    return;
                                }

                                popup = tippy("body", {
                                    getReferenceClientRect: props.clientRect as () => DOMRect,
                                    appendTo: () => document.body,
                                    content: component.element,
                                    showOnCreate: true,
                                    interactive: true,
                                    trigger: "manual",
                                    placement: "bottom-start",
                                    theme: "vik-slash"
                                });
                            },

                            onUpdate: props => {
                                component.updateProps({
                                    items: props.items,
                                    command: (item: CommandItem) => {
                                        props.command(item);
                                    }
                                });

                                if (!props.clientRect) {
                                    return;
                                }

                                popup[0]?.setProps({
                                    getReferenceClientRect: props.clientRect as () => DOMRect
                                });
                            },

                            onKeyDown: props => {
                                if (props.event.key === "Escape") {
                                    popup[0]?.hide();
                                    return true;
                                }
                                return component.ref?.onKeyDown(props) ?? false;
                            },

                            onExit: () => {
                                popup?.[0]?.destroy();
                                component?.destroy();
                            }
                        };
                    }
                })
            ];
        }
    });
};
