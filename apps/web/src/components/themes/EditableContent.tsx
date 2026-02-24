'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Image as ImageIcon, Check, X, Palette, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface EditableTextProps {
    value: string;
    onSave: (newValue: string) => void;
    isPreview?: boolean;
    className?: string;
    multiline?: boolean;
    label?: string;
}

export function EditableText({ value, onSave, isPreview, className = '', multiline = false, label }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    if (!isPreview) {
        return <span className={className}>{value}</span>;
    }

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="relative group/editable min-w-[100px] w-full">
                {multiline ? (
                    <textarea
                        ref={inputRef as any}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className={`w-full bg-white/10 backdrop-blur-md border-2 border-primary/50 rounded-xl p-2 outline-none text-inherit ${className}`}
                        rows={3}
                    />
                ) : (
                    <input
                        ref={inputRef as any}
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className={`w-full bg-white/10 backdrop-blur-md border-2 border-primary/50 rounded-xl px-2 py-1 outline-none text-inherit ${className}`}
                    />
                )}
                <div className="absolute -bottom-10 right-0 flex items-center gap-1 z-50">
                    <button
                        onClick={handleSave}
                        className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600 transition-colors"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-2 bg-rose-500 text-white rounded-lg shadow-lg hover:bg-rose-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <span
            className={`relative group/editable cursor-pointer inline-block ${className}`}
            onClick={() => setIsEditing(true)}
        >
            {value || <span className="opacity-50 italic">Set {label || 'content'}...</span>}
            <span className="absolute -top-4 -right-4 p-1.5 bg-primary text-white rounded-full opacity-0 group-hover/editable:opacity-100 transition-opacity shadow-lg z-20">
                <Pencil className="w-3 h-3" />
            </span>
            <span className="absolute inset-0 border-2 border-transparent group-hover/editable:border-primary/30 rounded-lg pointer-events-none -m-1" />
        </span>
    );
}

interface EditableImageProps {
    src?: string | null;
    onSave: (newUrl: string) => void;
    isPreview?: boolean;
    className?: string;
    aspectRatio?: string;
    label?: string;
}

export function EditableImage({ src, onSave, isPreview, className = '', aspectRatio = 'aspect-square', label }: EditableImageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempUrl, setTempUrl] = useState(src || '');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isPreview) {
        return src ? <img src={src} className={className} alt="" /> : null;
    }

    const handleSave = () => {
        onSave(tempUrl);
        setIsEditing(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 10MB Limit check
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File is too large! Maximum limit is 10MB.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/stores/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setTempUrl(res.data.url);
            onSave(res.data.url);
            setIsEditing(false);
        } catch (err: any) {
            console.error('Upload failed:', err);
            const message = err.response?.status === 413
                ? 'File is too large for the server.'
                : 'Failed to upload image. Please try again.';
            alert(message);
        } finally {
            setIsUploading(false);
        }
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className={`relative group/image ${className} ${isEditing ? 'transform-none !transition-none' : ''}`}>
            {src ? (
                <img src={src} className="w-full h-full object-cover" alt="" />
            ) : (
                <div className={`w-full h-full bg-slate-100 flex flex-col items-center justify-center p-4 text-center ${aspectRatio}`}>
                    <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label ? `No ${label} Set` : 'No Image Set'}</p>
                </div>
            )}

            <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                onClick={() => setIsEditing(true)}
            >
                <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Change Media</span>
                </div>
            </div>

            {mounted && createPortal(
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsEditing(false)}
                        >
                            <div
                                className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Update Media</h3>
                                <div className="space-y-6">
                                    {/* Upload Box */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Direct Upload</label>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all group/upload disabled:opacity-50"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Uploading to Cloud...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover/upload:scale-110 group-hover/upload:rotate-3 transition-transform">
                                                        <Upload className="w-6 h-6 text-slate-400 group-hover/upload:text-primary" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Click to browse gallery</p>
                                                        <p className="text-[9px] font-medium text-slate-400 mt-1">PNG, JPG or WebP (Max. 10MB)</p>
                                                    </div>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-slate-100" />
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Or use URL</span>
                                        <div className="h-px flex-1 bg-slate-100" />
                                    </div>

                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={tempUrl}
                                            onChange={e => setTempUrl(e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-[12px] font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="Paste image URL here..."
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Apply URL
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

interface EditableColorProps {
    value: string;
    onSave: (newColor: string) => void;
    isPreview?: boolean;
    label?: string;
}

export function EditableColor({ value, onSave, isPreview, label }: EditableColorProps) {
    if (!isPreview) return null;

    return (
        <div className="relative group/color inline-flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/10 cursor-pointer">
            <div
                className="w-6 h-6 rounded-full shadow-inner border border-white/20"
                style={{ backgroundColor: value }}
            />
            <span className="text-[9px] font-black text-white uppercase tracking-widest pr-2">{label || 'Color'}</span>
            <input
                type="color"
                value={value}
                onChange={e => onSave(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-tighter rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap">
                Click to Change
            </div>
        </div>
    );
}
