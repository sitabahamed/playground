"use client";
import { useCallback, useState, useRef } from "react";

interface FileUploaderProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  icon?: string;
  label?: string;
  description?: string;
}

export default function FileUploader({
  accept,
  multiple = false,
  onFilesSelected,
  icon = "📂",
  label = "Select files",
  description,
}: FileUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      onFilesSelected(files);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onFilesSelected]
  );

  return (
    <div
      className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
        dragging
          ? "border-red-500 bg-red-50"
          : "border-gray-300 bg-white hover:border-red-400 hover:bg-red-50/30"
      }`}
      style={{ borderWidth: "3px" }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-lg font-semibold text-gray-700 mb-2">{label}</p>
      <p className="text-gray-400 text-sm mb-4">or drop files here</p>
      {description && <p className="text-gray-400 text-xs">{description}</p>}
      <button
        type="button"
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-full transition shadow-md"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
      >
        {label}
      </button>
    </div>
  );
}
