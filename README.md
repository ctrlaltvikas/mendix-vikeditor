# VikEditor - Medium-Style Blog WYSIWYG Editor for Mendix 10

A distraction-free, Medium-inspired block-style and inline-toolbar WYSIWYG editor widget built for **Mendix 10.x Web & Responsive** applications. Powered by **TipTap 2.x** and **React 18**.

---

## ✨ Features

- **Inline Floating Selection Toolbar (Medium Bubble Menu)**: Highlight any text to format with Bold, Italic, Underline, Strikethrough, Code, Links, Headings (H1/H2/H3), Blockquotes, and Callout alerts.
- **Empty-line '+' Block Adder**: Hover or place cursor on an empty line to click the expandable '+' tray for inserting images, videos, tables, code blocks, dividers, and callouts.
- **Slash Commands (`/`)**: Type `/` anywhere to trigger a searchable command palette for quick block creation without lifting your hands from the keyboard.
- **Automatic Word Document (.docx) to Blog Converter**: Drag and drop any Microsoft Word `.docx` file onto the editor canvas, type `/docx` in the slash command palette, or select it from the `+` block menu. Converts Word headings, text styling, lists, tables, and embedded images directly into native TipTap blog blocks.
- **Rich Content Blocks**:
  - **Syntax-Highlighted Code Blocks**: Built-in support for JavaScript, TypeScript, Python, HTML, CSS, SQL, Java, Bash, and JSON with `lowlight`.
  - **Interactive Tables**: Responsive tables with contextual floating controls to add/remove rows and columns and toggle headers.
  - **Callout / Alert Boxes**: Highlighted info, tip, warning, and danger banners.
  - **Task Lists / Checklists**: Interactive checkable to-do items.
  - **Media & Embeds**: YouTube & Vimeo responsive video embedding via URL.
  - **Images**: Drag-and-drop, file upload (Base64 encoding), or web image URL with captions.
  - **Reading Statistics**: Real-time word count, character count, and estimated reading time.
- **Mendix Synchronization**:
  - **Debounced Auto-Sync**: Commits changes to Mendix attribute with configurable millisecond delay (e.g. 500ms) to ensure smooth typing without flooding the Mendix client.
  - **On-Blur Sync**: Commits changes and triggers `OnChange` action only when the user clicks outside the editor.
- **Theme Presets**:
  - **Medium Classic Serif**: Charter / Georgia typography with generous reading line-height.
  - **Modern Clean Sans-Serif**: Inter / System-UI typography for SaaS documentation and tech blogs.
  - **Inherit Atlas UI Theme**: Adopts your Mendix application's current typography.
  - **Dark Mode**: Automatic dark mode adaptation matching Mendix Atlas UI dark theme.

---

## 🚀 Quick Start for Mendix Developers

### 1. Interactive Browser Playground (Testing & Debugging)

To run, debug, and test the editor directly in your browser with live HMR:

```bash
# Start local Vite playground
npm run dev
```

Then open `http://localhost:5173` in your browser. The playground provides live theme switching, read-only toggling, sample blog post loading, and real-time serialized HTML output inspection.

### 2. Build the Widget Package (.mpk)

To compile the production `.mpk` widget package for Mendix:

```bash
# Install dependencies
npm install

# Build production widget package
npm run build
```

The compiled Mendix widget package will be generated at:
```
dist/1.0.0/com.vikasyadav.widget.web.vikeditor.VikEditor.mpk
```

Copy the `.mpk` file into your Mendix project's `widgets/` folder, then press **F4** (Synchronize Project Directory) in Mendix Studio Pro.

---

## 🛠️ Configuration in Mendix Studio Pro

### Domain Model Setup
1. Create or open an entity in your Mendix Domain Model (e.g. `BlogPost` or `Article`).
2. Add an attribute of type **String** with length set to **Unlimited** (e.g. `ContentHtml`).

### Page Placement
1. Place a **Data View** on your page pointing to the entity (`BlogPost`).
2. Drag and drop **VikEditor** from the Toolbox inside the Data View.
3. In the widget properties:
   - **Content Attribute**: Select `ContentHtml`.
   - **Sync Mode**: Choose `Debounced` (default 500ms) or `On Blur`.
   - **On Change**: (Optional) Attach a Nanoflow or Microflow to auto-save or update draft status.
   - **Typography Theme**: Select `Medium Classic Serif` or `Modern Clean Sans-Serif`.

---

## 📋 Widget Properties Reference

| Group | Property | Type | Default | Description |
|---|---|---|---|---|
| **Data Source** | `contentAttribute` | String Attribute | Required | Unlimited string attribute storing editor HTML. |
| **Data Source** | `placeholder` | String | `"Tell your story..."` | Canvas placeholder when empty. |
| **Synchronization** | `syncMode` | Enumeration | `debounced` | `debounced` (real-time delay) or `onBlur` (on unfocus). |
| **Synchronization** | `debounceDelay` | Integer | `500` | Delay in ms before saving in debounced mode. |
| **Synchronization** | `onChange` | Action | Optional | Nanoflow/Microflow triggered when content updates. |
| **Appearance** | `themePreset` | Enumeration | `mediumSerif` | `mediumSerif`, `modernSans`, or `inheritMendix`. |
| **Appearance** | `maxWidth` | String | `740px` | Maximum reading canvas width. |
| **Appearance** | `minHeight` | String | `320px` | Minimum canvas height. |
| **Features** | `enableBubbleMenu` | Boolean | `true` | Show floating inline formatting toolbar on highlight. |
| **Features** | `enableFloatingMenu`| Boolean | `true` | Show '+' block insertion button on empty line. |
| **Features** | `enableSlashCommands`| Boolean | `true` | Enable `/` slash command palette. |
| **Features** | `enableCodeBlocks` | Boolean | `true` | Syntax-highlighted code blocks. |
| **Features** | `enableTables` | Boolean | `true` | Responsive tables with row/col controls. |
| **Features** | `enableCallouts` | Boolean | `true` | Colored alert / callout banners. |
| **Features** | `enableTaskLists` | Boolean | `true` | Checkable task list items. |
| **Features** | `enableMediaEmbeds`| Boolean | `true` | Responsive YouTube and Vimeo embeds. |
| **Features** | `enableImages` | Boolean | `true` | Images via upload or URL. |
| **Features** | `enableDocxImport` | Boolean | `true` | Auto-convert dropped or selected Word (.docx) files. |
| **Features** | `enableReadingStats`| Boolean | `true` | Footer showing words, characters, read time. |
| **Media Upload** | `imageUploadMode` | Enumeration | `base64` | `base64` (inlined), `urlOnly`, or `customHandler`. |
| **Media Upload** | `onImageUpload` | Action | Optional | Custom Microflow/Nanoflow upload handler. |

---

## 💻 Tech Stack

- **Target Runtime**: Mendix 10.x Web & Responsive
- **UI Framework**: React 18
- **Core Engine**: TipTap 2.x (ProseMirror)
- **Highlighter**: Lowlight 3.x
- **Popups**: Tippy.js
- **Tooling**: `@mendix/pluggable-widgets-tools`
- **Language**: TypeScript 5.4+

---

## 📄 License

Apache License 2.0 - Created by Vikas Yadav.
