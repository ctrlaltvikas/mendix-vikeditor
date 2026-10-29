import { Node, mergeAttributes } from "@tiptap/core";

export type CalloutType = "info" | "warning" | "tip" | "danger";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        callout: {
            setCallout: (attributes?: { type?: CalloutType }) => ReturnType;
            toggleCallout: (attributes?: { type?: CalloutType }) => ReturnType;
            unsetCallout: () => ReturnType;
        };
    }
}

export const CalloutExtension = Node.create({
    name: "callout",
    group: "block",
    content: "block+",
    defining: true,

    addAttributes() {
        return {
            type: {
                default: "info",
                parseHTML: element => element.getAttribute("data-callout-type") || "info",
                renderHTML: attributes => {
                    return {
                        "data-type": "callout",
                        "data-callout-type": attributes.type,
                        class: `vik-callout vik-callout-${attributes.type}`
                    };
                }
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="callout"]'
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setCallout:
                attributes =>
                ({ commands }) => {
                    return commands.wrapIn(this.name, attributes);
                },
            toggleCallout:
                attributes =>
                ({ commands }) => {
                    return commands.toggleWrap(this.name, attributes);
                },
            unsetCallout:
                () =>
                ({ commands }) => {
                    return commands.lift(this.name);
                }
        };
    },

    addKeyboardShortcuts() {
        return {
            Backspace: () => {
                const { empty, $anchor } = this.editor.state.selection;
                const isAtStart = $anchor.parentOffset === 0;

                if (!empty || !isAtStart) {
                    return false;
                }

                return this.editor.commands.lift(this.name);
            }
        };
    }
});
