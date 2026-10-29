import React, { createElement, useState, useEffect, useRef, useCallback } from "react";
import { VikEditorContainerProps } from "../typings/VikEditorProps";
import { VikEditorComponent } from "./components/VikEditorComponent";

import "./ui/VikEditor.scss";

export default function VikEditor(props: VikEditorContainerProps) {
    const {
        contentAttribute,
        placeholder,
        syncMode,
        debounceDelay,
        onChange,
        themePreset,
        maxWidth,
        minHeight,
        enableBubbleMenu,
        enableFloatingMenu,
        enableSlashCommands,
        enableCodeBlocks,
        enableTables,
        enableCallouts,
        enableTaskLists,
        enableMediaEmbeds,
        enableImages,
        enableDocxImport,
        enableReadingStats,
        imageUploadMode,
        onImageUpload,
        class: customClass,
        style
    } = props;

    const isAvailable = contentAttribute && contentAttribute.status === "available";
    const initialValue = isAvailable ? contentAttribute.value || "" : "";

    const [currentValue, setCurrentValue] = useState<string>(initialValue);
    const pendingValueRef = useRef<string>(initialValue);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Keep internal state updated if Mendix attribute changes externally
    useEffect(() => {
        if (isAvailable && contentAttribute.value !== undefined) {
            const externalVal = contentAttribute.value || "";
            if (externalVal !== pendingValueRef.current) {
                pendingValueRef.current = externalVal;
                setCurrentValue(externalVal);
            }
        }
    }, [isAvailable, contentAttribute?.value]);

    const isContentEmpty = (html?: string) => !html || html === "<p></p>" || html === "<p><br></p>";

    const commitToMendix = useCallback(
        (htmlToCommit: string) => {
            if (!contentAttribute || contentAttribute.readOnly) {
                return;
            }

            const currentVal = contentAttribute.value || "";
            if (isContentEmpty(currentVal) && isContentEmpty(htmlToCommit)) {
                return;
            }

            if (currentVal !== htmlToCommit) {
                contentAttribute.setValue(htmlToCommit);

                if (onChange && onChange.canExecute && !onChange.isExecuting) {
                    onChange.execute();
                }
            }
        },
        [contentAttribute, onChange]
    );

    // Handle editor content updates
    const handleChange = useCallback(
        (newHtml: string) => {
            pendingValueRef.current = newHtml;

            if (syncMode === "debounced") {
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                }

                debounceTimerRef.current = setTimeout(() => {
                    commitToMendix(newHtml);
                }, debounceDelay || 500);
            }
        },
        [syncMode, debounceDelay, commitToMendix]
    );

    // Handle blur event
    const handleBlur = useCallback(() => {
        if (syncMode === "onBlur") {
            commitToMendix(pendingValueRef.current);
        } else if (debounceTimerRef.current) {
            // Flush immediately on blur even if debounced
            clearTimeout(debounceTimerRef.current);
            commitToMendix(pendingValueRef.current);
        }
    }, [syncMode, commitToMendix]);

    // Flush on unmount to prevent data loss
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                commitToMendix(pendingValueRef.current);
            }
        };
    }, [commitToMendix]);

    const handleTriggerMendixUpload = useCallback(() => {
        if (onImageUpload && onImageUpload.canExecute && !onImageUpload.isExecuting) {
            onImageUpload.execute();
        }
    }, [onImageUpload]);

    if (!isAvailable) {
        return (
            <div className={`vik-editor-loading ${customClass || ""}`} style={style}>
                <div className="vik-loading-spinner" />
                <span>Loading editor...</span>
            </div>
        );
    }

    const isReadOnly = contentAttribute.readOnly;

    return (
        <div className={`vik-editor-wrapper ${customClass || ""}`} style={style}>
            <VikEditorComponent
                value={currentValue}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                readOnly={isReadOnly}
                themePreset={themePreset}
                maxWidth={maxWidth}
                minHeight={minHeight}
                enableBubbleMenu={enableBubbleMenu}
                enableFloatingMenu={enableFloatingMenu}
                enableSlashCommands={enableSlashCommands}
                enableCodeBlocks={enableCodeBlocks}
                enableTables={enableTables}
                enableCallouts={enableCallouts}
                enableTaskLists={enableTaskLists}
                enableMediaEmbeds={enableMediaEmbeds}
                enableImages={enableImages}
                enableDocxImport={enableDocxImport}
                enableReadingStats={enableReadingStats}
                imageUploadMode={imageUploadMode}
                onTriggerMendixUpload={handleTriggerMendixUpload}
            />
        </div>
    );
}
