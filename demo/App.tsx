import React, { useState } from "react";
import { VikEditorComponent } from "../src/components/VikEditorComponent";
import { ThemePresetEnum } from "../typings/VikEditorProps";
import "../src/ui/VikEditor.scss";

const SAMPLE_CONTENT = `
<h1>The Art of Clean Engineering in Mendix 10</h1>
<p>Writing elegant, maintainable code is not merely about making things work—it is about crafting software that future developers, and your future self, will genuinely appreciate working with.</p>
<blockquote>"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra</blockquote>
<p>With modern <strong>Mendix 10 pluggable widgets</strong>, developers can bridge the gap between enterprise low-code speed and cutting-edge React 18 user experiences.</p>
<div data-type="callout" data-callout-type="info" class="vik-callout vik-callout-info">
    <p><strong>Pro-Tip:</strong> TipTap 2.x ProseMirror architecture provides headless, schema-driven editing with complete control over the DOM output.</p>
</div>
<pre class="vik-code-block"><code class="language-typescript">// Example: Debounced synchronization in VikEditor
const commitToMendix = (html: string) => {
    if (contentAttribute && !contentAttribute.readOnly) {
        contentAttribute.setValue(html);
    }
};</code></pre>
<ul class="vik-task-list">
    <li class="vik-task-item" data-checked="true"><label><input type="checkbox" checked></label><div>ProseMirror core initialized</div></li>
    <li class="vik-task-item" data-checked="true"><label><input type="checkbox" checked></label><div>Medium Bubble Menu with inline formatting</div></li>
    <li class="vik-task-item" data-checked="false"><label><input type="checkbox"></label><div>Ready for production deployment</div></li>
</ul>
<table class="vik-table">
    <thead>
        <tr><th>Feature</th><th>Medium Style</th><th>VikEditor Status</th></tr>
    </thead>
    <tbody>
        <tr><td>Bubble Menu</td><td>Inline on select</td><td>Active</td></tr>
        <tr><td>Block Tray</td><td>Expandable '+'</td><td>Active</td></tr>
        <tr><td>Slash Commands</td><td>Keyboard quick nav</td><td>Active</td></tr>
    </tbody>
</table>
<hr>
<p>Highlight text above to see the <em>Medium Bubble Toolbar</em>, place cursor on an empty line to click the <em>'+' block menu</em>, or type <code>/</code> for quick slash commands.</p>
`;

export const App: React.FC = () => {
    const [content, setContent] = useState<string>(SAMPLE_CONTENT);
    const [theme, setTheme] = useState<ThemePresetEnum>("mediumSerif");
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"editor" | "html">("editor");

    const handleClear = () => {
        setContent("<p></p>");
    };

    const handleResetSample = () => {
        setContent(SAMPLE_CONTENT);
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
            {/* Top Toolbar */}
            <header
                style={{
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "12px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10b981" }} />
                    <span style={{ fontWeight: 700, fontSize: "16px", color: "#0f172a" }}>VikEditor</span>
                    <span
                        style={{
                            fontSize: "12px",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            backgroundColor: "#e0f2fe",
                            color: "#0369a1",
                            fontWeight: 600
                        }}
                    >
                        Browser Playground
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Theme Selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#475569" }}>
                        <label htmlFor="theme-select">Theme:</label>
                        <select
                            id="theme-select"
                            value={theme}
                            onChange={e => setTheme(e.target.value as ThemePresetEnum)}
                            style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                background: "#ffffff",
                                fontSize: "13px",
                                cursor: "pointer"
                            }}
                        >
                            <option value="mediumSerif">Medium Classic Serif</option>
                            <option value="modernSans">Modern Clean Sans</option>
                            <option value="inheritMendix">Atlas UI Theme</option>
                        </select>
                    </div>

                    {/* ReadOnly Checkbox */}
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#475569", cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={readOnly}
                            onChange={e => setReadOnly(e.target.checked)}
                            style={{ cursor: "pointer" }}
                        />
                        Read-only
                    </label>

                    {/* View Switcher */}
                    <div style={{ display: "flex", borderRadius: "6px", border: "1px solid #cbd5e1", overflow: "hidden" }}>
                        <button
                            type="button"
                            onClick={() => setActiveTab("editor")}
                            style={{
                                padding: "6px 12px",
                                border: "none",
                                background: activeTab === "editor" ? "#0284c7" : "#ffffff",
                                color: activeTab === "editor" ? "#ffffff" : "#475569",
                                fontSize: "13px",
                                fontWeight: 500,
                                cursor: "pointer"
                            }}
                        >
                            Live Editor
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("html")}
                            style={{
                                padding: "6px 12px",
                                border: "none",
                                background: activeTab === "html" ? "#0284c7" : "#ffffff",
                                color: activeTab === "html" ? "#ffffff" : "#475569",
                                fontSize: "13px",
                                fontWeight: 500,
                                cursor: "pointer"
                            }}
                        >
                            HTML Output
                        </button>
                    </div>

                    {/* Actions */}
                    <button
                        type="button"
                        onClick={handleResetSample}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            fontSize: "13px",
                            cursor: "pointer",
                            color: "#334155"
                        }}
                    >
                        Reset Sample
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #fee2e2",
                            background: "#fef2f2",
                            color: "#b91c1c",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        Clear
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: "40px 20px", display: "flex", justifyContent: "center" }}>
                <div
                    style={{
                        width: "100%",
                        maxWidth: "840px",
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
                        border: "1px solid #e2e8f0",
                        padding: "36px 48px",
                        minHeight: "650px",
                        boxSizing: "border-box"
                    }}
                >
                    {activeTab === "editor" ? (
                        <VikEditorComponent
                            value={content}
                            onChange={newHtml => setContent(newHtml)}
                            placeholder="Tell your story, or type '/' for commands..."
                            themePreset={theme}
                            readOnly={readOnly}
                            maxWidth="100%"
                            minHeight="450px"
                            enableBubbleMenu={true}
                            enableFloatingMenu={true}
                            enableSlashCommands={true}
                            enableCodeBlocks={true}
                            enableTables={true}
                            enableCallouts={true}
                            enableTaskLists={true}
                            enableMediaEmbeds={true}
                            enableImages={true}
                            enableReadingStats={true}
                            imageUploadMode="base64"
                        />
                    ) : (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <span style={{ fontWeight: 600, fontSize: "14px", color: "#334155" }}>Serialized HTML Source</span>
                                <span style={{ fontSize: "12px", color: "#64748b" }}>{content.length} characters</span>
                            </div>
                            <pre
                                style={{
                                    backgroundColor: "#0f172a",
                                    color: "#38bdf8",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    lineHeight: 1.6,
                                    overflowX: "auto",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-all"
                                }}
                            >
                                {content}
                            </pre>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
