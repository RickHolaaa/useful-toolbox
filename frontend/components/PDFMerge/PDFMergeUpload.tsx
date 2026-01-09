"use client";

import { useState, useRef } from "react";

// Backend base URL (Docker: http://backend:8000, local dev: http://localhost:8000)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

interface PDFFile {
  id: string;
  file: File;
  name: string;
}

export default function PDFMergeUpload() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles)
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
      }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= files.length) return;
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  // Drag and drop reordering
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);
    setFiles(newFiles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleMerge = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((pdf) => {
        formData.append("files", pdf.file);
      });

      const response = await fetch(`${API_BASE}/api/pdf/merge`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Merge failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      
      // Clear files after successful merge
      setFiles([]);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("Failed to merge PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative max-w-2xl mx-auto p-12 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 backdrop-blur-[8px] shadow-lg ${
          isDragging
            ? "border-white/60 bg-white/20 scale-[1.02]"
            : "border-white/20 bg-black/10 hover:border-white/40 hover:bg-black/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-lg font-semibold text-white mb-2">
            {files.length === 0
              ? "Click or drag PDFs here"
              : `${files.length} PDF(s) selected`}
          </p>
          <p className="text-sm text-white/60">
            {files.length === 0
              ? "You can upload multiple PDF files"
              : "Add more or drag cards to reorder"}
          </p>
        </div>
      </div>

      {/* Horizontal File List */}
      {files.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-white/80 text-center">
            PDFs to Merge ({files.length}) - Drag to reorder
          </h3>

          <div className="flex flex-wrap gap-4 justify-center">
            {files.map((file, index) => (
              <div
                key={file.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`relative flex flex-col w-48 p-4 rounded-2xl backdrop-blur-[8px] border border-white/20 bg-black/10 hover:bg-white/10 transition-all duration-300 cursor-move group shadow-lg hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)] hover:scale-105 ${
                  draggedIndex === index ? "opacity-50 scale-95" : ""
                }`}
              >
                {/* Order Number Badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full backdrop-blur-xl border border-white/30 bg-white/20 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {index + 1}
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full backdrop-blur-xl border border-white/30 bg-red-500/80 hover:bg-red-600/90 transition-colors flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* PDF Icon */}
                <div className="flex items-center justify-center h-24 mb-3">
                  <svg
                    className="w-16 h-16 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* File Name */}
                <p className="text-white text-sm truncate text-center mb-2" title={file.name}>
                  {file.name}
                </p>

                {/* File Size */}
                <p className="text-xs text-white/50 text-center mb-4">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {/* Move Buttons */}
                <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveFile(index, index - 1);
                    }}
                    disabled={index === 0}
                    className="p-2 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move left"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveFile(index, index + 1);
                    }}
                    disabled={index === files.length - 1}
                    className="p-2 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move right"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Merge Button */}
      {files.length > 0 && (
        <button
          onClick={handleMerge}
          disabled={isProcessing || files.length < 2}
          className="w-full max-w-md mx-auto block p-4 rounded-2xl backdrop-blur-xl border border-white/30 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
        >
          {isProcessing ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Merging...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Merge {files.length} PDF{files.length !== 1 ? "s" : ""}
              {files.length < 2 && " (minimum 2 required)"}
            </>
          )}
        </button>
      )}
    </div>
  );
}
