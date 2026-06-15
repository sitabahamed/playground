"use client";
import ToolLayout from "../components/ToolLayout";
import PDFToolClient from "../components/PDFToolClient";
import { useState } from "react";

export default function RotatePDF() {
  const [rotation, setRotation] = useState("90");

  const rotationOptions = [
    { value: "90", label: "90° Clockwise", icon: "↻" },
    { value: "180", label: "180°", icon: "↔" },
    { value: "270", label: "90° Counter-clockwise", icon: "↺" },
  ];

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once."
      icon="🔄"
      color="bg-gradient-to-br from-teal-500 to-teal-700"
    >
      <PDFToolClient
        apiEndpoint="/api/rotate"
        accept=".pdf,application/pdf"
        multiple={false}
        buttonLabel="🔄 Rotate PDF"
        processingLabel="Rotating PDF..."
        uploaderLabel="Select PDF file"
        uploaderIcon="📂"
        uploaderDescription="Upload a PDF to rotate its pages"
        downloadName="rotated.pdf"
        extraState={{ rotation }}
        extraFields={
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Rotation direction:</p>
            <div className="flex gap-3 flex-wrap">
              {rotationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRotation(opt.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium transition ${
                    rotation === opt.value
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
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
