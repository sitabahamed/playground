import ToolLayout from "../components/ToolLayout";
import PDFToolClient from "../components/PDFToolClient";

export const metadata = { title: "Merge PDF - iLovePDF" };

export default function MergePDF() {
  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one. Simply upload your files and click Merge PDF."
      icon="🔗"
      color="bg-gradient-to-br from-red-500 to-red-700"
    >
      <PDFToolClient
        apiEndpoint="/api/merge"
        accept=".pdf,application/pdf"
        multiple={true}
        buttonLabel="🔗 Merge PDF"
        processingLabel="Merging PDFs..."
        uploaderLabel="Select PDF files"
        uploaderIcon="📂"
        uploaderDescription="Upload 2 or more PDF files to merge them"
        downloadName="merged.pdf"
      />
    </ToolLayout>
  );
}
