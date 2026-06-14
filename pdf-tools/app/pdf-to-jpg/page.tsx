"use client";
import ToolLayout from "../components/ToolLayout";
import PDFToolClient from "../components/PDFToolClient";
import { useState } from "react";

export default function PDFToJPG() {
  const [dpi, setDpi] = useState("150");

  return (
    <ToolLayout
      title="PDF to JPG"
      description="Convert each PDF page into a high-quality JPG image."
      icon="🖼️"
      color="bg-gradient-to-br from-blue-500 to-blue-700"
    >
      <PDFToolClient
        apiEndpoint="/api/pdf-to-jpg"
        accept=".pdf,application/pdf"
        multiple={false}
        buttonLabel="🖼️ Convert to JPG"
        processingLabel="Converting PDF..."
        uploaderLabel="Select PDF file"
        uploaderIcon="📂"
        uploaderDescription="Upload a PDF to convert each page into a JPG image"
        downloadName="pdf-images.zip"
        extraState={{ dpi }}
        extraFields={
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Image quality (DPI):</p>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: "72", label: "Low (72 DPI)" },
                { value: "150", label: "Medium (150 DPI)" },
                { value: "300", label: "High (300 DPI)" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDpi(opt.value)}
                  className={`px-4 py-2 rounded-xl border-2 font-medium transition text-sm ${
                    dpi === opt.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        }
      />
    </ToolLayout>
  );
}
