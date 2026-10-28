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
                    return commands.setNode(this.name, attributes);
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
    }
});
