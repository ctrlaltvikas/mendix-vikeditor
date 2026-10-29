import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
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

export interface CommandItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    command: (props: { editor: any; range: any }) => void;
}

export interface SlashCommandListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface SlashCommandListProps {
    items: CommandItem[];
    command: (item: CommandItem) => void;
}

export const SlashCommandList = forwardRef<SlashCommandListRef, SlashCommandListProps>(({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelectedIndex((prevIndex) => (prevIndex + items.length - 1) % items.length);
                return true;
            }
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelectedIndex((prevIndex) => (prevIndex + 1) % items.length);
                return true;
            }
            if (
                event.key === "Enter" ||
                event.key === "Tab" ||
                event.key === " " ||
                event.key === "/"
            ) {
                if (items[selectedIndex]) {
                    event.preventDefault();
                    command(items[selectedIndex]);
                    return true;
                }
            }
            return false;
        }
    }));

    if (!items.length) {
        return (
            <div className="vik-slash-menu-empty">
                <span>No commands matching</span>
            </div>
        );
    }

    return (
        <div className="vik-slash-menu">
            <div className="vik-slash-menu-header">Basic Blocks</div>
            {items.map((item, index) => (
                <button
                    type="button"
                    key={item.title}
                    className={`vik-slash-item ${index === selectedIndex ? "is-selected" : ""}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        command(item);
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        command(item);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    <div className="vik-slash-item-icon">{item.icon}</div>
                    <div className="vik-slash-item-content">
                        <div className="vik-slash-item-title">{item.title}</div>
                        <div className="vik-slash-item-desc">{item.description}</div>
                    </div>
                </button>
            ))}
        </div>
    );
});

SlashCommandList.displayName = "SlashCommandList";
