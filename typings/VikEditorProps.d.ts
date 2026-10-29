/**
 * This file was generated from VikEditor.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";

export type SyncModeEnum = "debounced" | "onBlur";

export type ThemePresetEnum = "mediumSerif" | "modernSans" | "inheritMendix";

export type ImageUploadModeEnum = "base64" | "urlOnly" | "customHandler";

export interface VikEditorContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    contentAttribute: EditableValue<string>;
    placeholder: string;
    syncMode: SyncModeEnum;
    debounceDelay: number;
    onChange?: ActionValue;
    themePreset: ThemePresetEnum;
    maxWidth: string;
    minHeight: string;
    enableBubbleMenu: boolean;
    enableFloatingMenu: boolean;
    enableSlashCommands: boolean;
    enableCodeBlocks: boolean;
    enableTables: boolean;
    enableCallouts: boolean;
    enableTaskLists: boolean;
    enableMediaEmbeds: boolean;
    enableImages: boolean;
    enableDocxImport: boolean;
    enableReadingStats: boolean;
    imageUploadMode: ImageUploadModeEnum;
    onImageUpload?: ActionValue;
}

export interface VikEditorPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    contentAttribute: string;
    placeholder: string;
    syncMode: SyncModeEnum;
    debounceDelay: number | null;
    onChange: {} | null;
    themePreset: ThemePresetEnum;
    maxWidth: string;
    minHeight: string;
    enableBubbleMenu: boolean;
    enableFloatingMenu: boolean;
    enableSlashCommands: boolean;
    enableCodeBlocks: boolean;
    enableTables: boolean;
    enableCallouts: boolean;
    enableTaskLists: boolean;
    enableMediaEmbeds: boolean;
    enableImages: boolean;
    enableDocxImport: boolean;
    enableReadingStats: boolean;
    imageUploadMode: ImageUploadModeEnum;
    onImageUpload: {} | null;
}
