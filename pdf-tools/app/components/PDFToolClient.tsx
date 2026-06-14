"use client";
import { useState, useCallback } from "react";
import FileUploader from "./FileUploader";

interface FileItem {
  file: File;
  id: string;
}

interface PDFToolClientProps {
  apiEndpoint: string;
  accept: string;
  multiple?: boolean;
  extraFields?: React.ReactNode;
  getFormData?: (files: File[], extra: Record<string, string>) => FormData;
  downloadName?: string;
  buttonLabel?: string;
  processingLabel?: string;
  uploaderLabel?: string;
  uploaderIcon?: string;
  uploaderDescription?: string;
  onResult?: (response: Response, files: File[]) => void;
  extraState?: Record<string, string>;
}

export default function PDFToolClient({
  apiEndpoint,
  accept,
  multiple = false,
  extraFields,
  getFormData,
  downloadName = "result.pdf",
  buttonLabel = "Process",
  processingLabel = "Processing...",
  uploaderLabel,
  uploaderIcon,
  uploaderDescription,
  onResult,
  extraState = {},
}: PDFToolClientProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState(downloadName);
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [resultSize, setResultSize] = useState(0);

  const handleFiles = useCallback((newFiles: File[]) => {
    setStatus("idle");
    setDownloadUrl(null);
    setErrorMsg("");
    if (multiple) {
      setFiles((prev) => [
        ...prev,
        ...newFiles.map((f) => ({ file: f, id: Math.random().toString(36).slice(2) })),
      ]);
    } else {
      setFiles(newFiles.map((f) => ({ file: f, id: Math.random().toString(36).slice(2) })));
    }
  }, [multiple]);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (id: string, direction: "up" | "down") => {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setStatus("processing");
    setProgress(0);
    setDownloadUrl(null);
    setErrorMsg("");

    const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);
    setOriginalSize(totalSize);

    let form: FormData;
    if (getFormData) {
      form = getFormData(files.map((f) => f.file), extraState);
    } else {
      form = new FormData();
      if (multiple) {
        files.forEach((f) => form.append("files", f.file));
      } else {
        form.append("file", files[0].file);
      }
      Object.entries(extraState).forEach(([k, v]) => form.append(k, v));
    }

    const timer = setInterval(() => setProgress((p) => Math.min(p + 10, 85)), 300);

    try {
      const res = await fetch(apiEndpoint, { method: "POST", body: form });
      clearInterval(timer);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      if (onResult) {
        await onResult(res, files.map((f) => f.file));
        setStatus("done");
        return;
      }

      const blob = await res.blob();
      setResultSize(blob.size);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      const disposition = res.headers.get("Content-Disposition");
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) setDownloadFilename(match[1]);
      }

      setStatus("done");
    } catch (err) {
      clearInterval(timer);
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFiles([]);
    setStatus("idle");
    setDownloadUrl(null);
    setErrorMsg("");
    setProgress(0);
  };

  if (status === "done" && downloadUrl) {
    return (
      <div className="text-center bounce-in py-8">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Done!</h3>
        {resultSize > 0 && originalSize > 0 && (
          <p className="text-gray-500 mb-6">
            {originalSize > resultSize ? (
              <span className="text-green-600 font-semibold">
                Reduced by {Math.round((1 - resultSize / originalSize) * 100)}% ({formatBytes(originalSize)} → {formatBytes(resultSize)})
              </span>
            ) : (
              <span>{formatBytes(originalSize)} → {formatBytes(resultSize)}</span>
            )}
          </p>
        )}
        <a
          href={downloadUrl}
          download={downloadFilename}
          className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg transition mb-4"
        >
          ⬇️ Download
        </a>
        <br />
        <button onClick={reset} className="text-gray-500 hover:text-gray-700 mt-4 text-sm underline">
          Process another file
        </button>
      </div>
    );
  }

  return (
    <div>
      {files.length === 0 ? (
        <FileUploader
          accept={accept}
          multiple={multiple}
          onFilesSelected={handleFiles}
          icon={uploaderIcon}
          label={uploaderLabel || (multiple ? "Select PDF files" : "Select PDF file")}
          description={uploaderDescription}
        />
      ) : (
        <div>
          <div className="space-y-2 mb-6">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
              >
                <span className="text-red-500 text-xl">📄</span>
                <span className="flex-1 text-gray-700 text-sm font-medium truncate">{item.file.name}</span>
                <span className="text-gray-400 text-xs whitespace-nowrap">{formatBytes(item.file.size)}</span>
                {multiple && (
                  <>
                    <button
                      onClick={() => moveFile(item.id, "up")}
                      disabled={idx === 0}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-30 p-1"
                      title="Move up"
                    >↑</button>
                    <button
                      onClick={() => moveFile(item.id, "down")}
                      disabled={idx === files.length - 1}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-30 p-1"
                      title="Move down"
                    >↓</button>
                  </>
                )}
                <button
                  onClick={() => removeFile(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1 ml-1"
                  title="Remove"
                >✕</button>
              </div>
            ))}
          </div>

          {multiple && (
            <div className="mb-4">
              <FileUploader
                accept={accept}
                multiple={multiple}
                onFilesSelected={handleFiles}
                icon="➕"
                label="Add more files"
              />
            </div>
          )}

          {extraFields && <div className="mb-6">{extraFields}</div>}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-600 text-sm">
              ❌ {errorMsg}
            </div>
          )}

          {status === "processing" && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{processingLabel}</span>
                <span>{progress}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleProcess}
              disabled={status === "processing"}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-4 rounded-full text-lg transition shadow-lg"
            >
              {status === "processing" ? processingLabel : buttonLabel}
            </button>
            <button
              onClick={reset}
              className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-600 hover:border-gray-300 font-semibold transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
