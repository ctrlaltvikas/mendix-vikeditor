import React from "react";
import { Editor } from "@tiptap/react";

interface ReadingStatsProps {
    editor: Editor;
}

export const ReadingStats: React.FC<ReadingStatsProps> = ({ editor }) => {
    const words = editor.storage.characterCount?.words() ?? 0;
    const characters = editor.storage.characterCount?.characters() ?? 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    return (
        <div className="vik-reading-stats">
            <span className="vik-stat-item">
                <strong>{words}</strong> {words === 1 ? "word" : "words"}
            </span>
            <span className="vik-stat-dot">•</span>
            <span className="vik-stat-item">
                <strong>{characters}</strong> characters
            </span>
            <span className="vik-stat-dot">•</span>
            <span className="vik-stat-item">
                <strong>{readingTime}</strong> min read
            </span>
        </div>
    );
};
