import React, { useState, useRef } from "react";
import { CloseIcon, ImageIcon, VideoIcon } from "./Icons";
import { ImageUploadModeEnum } from "../../typings/VikEditorProps";

export type MediaDialogType = "image" | "video" | null;

interface MediaDialogProps {
    type: MediaDialogType;
    uploadMode: ImageUploadModeEnum;
    isOpen: boolean;
    onClose: () => void;
    onInsertImage: (src: string, alt?: string) => void;
    onInsertVideo: (url: string) => void;
    onTriggerMendixUpload?: () => void;
}

export const MediaDialog: React.FC<MediaDialogProps> = ({
    type,
    uploadMode,
    isOpen,
    onClose,
    onInsertImage,
    onInsertVideo,
    onTriggerMendixUpload
}) => {
    const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
    const [mediaUrl, setMediaUrl] = useState("");
    const [altText, setAltText] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen || !type) {
        return null;
    }

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file (PNG, JPG, GIF, WebP, SVG).");
            return;
        }

        if (uploadMode === "customHandler" && onTriggerMendixUpload) {
            onTriggerMendixUpload();
            onClose();
            return;
        }

        // Base64 encoding by default
        const reader = new FileReader();
        reader.onload = e => {
            const result = e.target?.result as string;
            if (result) {
                onInsertImage(result, file.name);
                onClose();
                setMediaUrl("");
                setAltText("");
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmitUrl = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mediaUrl.trim()) {
            return;
        }

        if (type === "image") {
            onInsertImage(mediaUrl.trim(), altText.trim());
        } else if (type === "video") {
            onInsertVideo(mediaUrl.trim());
        }

        setMediaUrl("");
        setAltText("");
        onClose();
    };

    return (
        <div className="vik-modal-backdrop" onClick={onClose}>
            <div className="vik-modal-dialog" onClick={e => e.stopPropagation()}>
                <div className="vik-modal-header">
                    <div className="vik-modal-title">
                        {type === "image" ? (
                            <>
                                <ImageIcon size={18} />
                                <span>Insert Image</span>
                            </>
                        ) : (
                            <>
                                <VideoIcon size={18} />
                                <span>Embed Video</span>
                            </>
                        )}
                    </div>
                    <button type="button" className="vik-modal-close-btn" onClick={onClose}>
                        <CloseIcon size={16} />
                    </button>
                </div>

                {type === "image" && (
                    <div className="vik-modal-tabs">
                        {uploadMode !== "urlOnly" && (
                            <button
                                type="button"
                                className={`vik-modal-tab ${activeTab === "upload" ? "is-active" : ""}`}
                                onClick={() => setActiveTab("upload")}
                            >
                                Upload File
                            </button>
                        )}
                        <button
                            type="button"
                            className={`vik-modal-tab ${activeTab === "url" || uploadMode === "urlOnly" ? "is-active" : ""}`}
                            onClick={() => setActiveTab("url")}
                        >
                            Embed from URL
                        </button>
                    </div>
                )}

                <div className="vik-modal-body">
                    {type === "image" && activeTab === "upload" && uploadMode !== "urlOnly" ? (
                        <div
                            className={`vik-dropzone ${isDragging ? "is-dragover" : ""}`}
                            onDragOver={e => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <div className="vik-dropzone-icon">
                                <ImageIcon size={32} />
                            </div>
                            <div className="vik-dropzone-title">Click to upload or drag &amp; drop</div>
                            <div className="vik-dropzone-sub">Supports PNG, JPG, GIF, WebP (Max 10MB)</div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitUrl}>
                            <div className="vik-form-group">
                                <label className="vik-form-label">
                                    {type === "image" ? "Image URL" : "YouTube or Vimeo Video URL"}
                                </label>
                                <input
                                    type="url"
                                    className="vik-form-input"
                                    placeholder={
                                        type === "image"
                                            ? "https://example.com/photo.jpg"
                                            : "https://www.youtube.com/watch?v=..."
                                    }
                                    value={mediaUrl}
                                    onChange={e => setMediaUrl(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>

                            {type === "image" && (
                                <div className="vik-form-group">
                                    <label className="vik-form-label">Caption / Alt text (optional)</label>
                                    <input
                                        type="text"
                                        className="vik-form-input"
                                        placeholder="Description of the image"
                                        value={altText}
                                        onChange={e => setAltText(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="vik-modal-footer">
                                <button type="button" className="vik-btn vik-btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="vik-btn vik-btn-primary">
                                    Insert {type === "image" ? "Image" : "Video"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
