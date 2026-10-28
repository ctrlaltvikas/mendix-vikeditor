import React, { createElement } from "react";
import { VikEditorPreviewProps } from "../typings/VikEditorProps";

export function preview(props: VikEditorPreviewProps) {
    const { placeholder, themePreset, maxWidth, minHeight } = props;

    return (
        <div
            className={`vik-editor-root vik-theme-${themePreset || "mediumSerif"} is-preview`}
            style={{
                maxWidth: maxWidth || "740px",
                minHeight: minHeight || "280px",
                padding: "24px",
                border: "1px dashed #cbd5e1",
                borderRadius: "8px",
                backgroundColor: "#fafafa"
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>VikEditor</span>
                    <span style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#e2e8f0", color: "#475569" }}>
                        Medium WYSIWYG
                    </span>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Theme: {themePreset || "mediumSerif"}
                </div>
            </div>

            <div style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "18px", marginTop: "16px" }}>
                {placeholder || "Tell your story, or type '/' for commands..."}
            </div>

            <div style={{ marginTop: "32px", fontSize: "13px", color: "#94a3b8" }}>
                [Interactive block &amp; inline toolbar active in runtime]
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/VikEditor.scss");
}
