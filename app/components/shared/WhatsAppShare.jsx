"use client";

import { useRef, useState } from "react";
import { Share2, Upload, X, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * WhatsAppShare
 *
 * Props:
 *  - mosqueName  {string}  Name of the mosque
 *  - message     {string}  Optional extra text to include in the WhatsApp message
 */
export default function WhatsAppShare({ mosqueName = "", message = "" }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);   // local blob URL for preview
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

    function handleFileChange(e) {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!ALLOWED_TYPES.includes(selected.type)) {
            setError("Only JPEG, PNG, GIF, or WebP images are allowed.");
            return;
        }
        if (selected.size > MAX_SIZE) {
            setError("Image must be smaller than 5 MB.");
            return;
        }

        setError("");
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    }

    function clearFile() {
        setFile(null);
        setPreview(null);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleShare() {
        setError("");

        // Build the WhatsApp message text
        const baseText = message || `Check out ${mosqueName || "this mosque"} prayer times on Salahtime!`;

        if (!file) {
            // Share without image
            openWhatsApp(baseText, null);
            return;
        }

        // Upload image first
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch(`${API_URL}/api/share/upload/`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Image upload failed.");
            }

            const data = await res.json();
            openWhatsApp(baseText, data.image_url);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setUploading(false);
        }
    }

    function openWhatsApp(text, imageUrl) {
        const fullText = imageUrl ? `${text}\n\n${imageUrl}` : text;
        const encoded = encodeURIComponent(fullText);
        window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Share2 size={15} className="text-[#25D366]" />
                Share on WhatsApp
            </p>

            {/* File picker */}
            <div className="flex items-center gap-3 flex-wrap">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    <Upload size={14} />
                    {file ? "Change Image" : "Upload Image (optional)"}
                </button>

                {preview && (
                    <div className="relative inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt="preview"
                            className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                        />
                        <button
                            type="button"
                            onClick={clearFile}
                            className="absolute -top-1.5 -right-1.5 bg-white border border-slate-300 rounded-full p-0.5 text-slate-500 hover:text-red-500"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            {/* Share button */}
            <button
                type="button"
                onClick={handleShare}
                disabled={uploading}
                className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1ebe5b] transition-colors disabled:opacity-60"
            >
                {uploading ? (
                    <>
                        <Loader2 size={15} className="animate-spin" />
                        Uploading…
                    </>
                ) : (
                    <>
                        <Share2 size={15} />
                        Share on WhatsApp
                    </>
                )}
            </button>
        </div>
    );
}
