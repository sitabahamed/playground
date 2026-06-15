import ToolLayout from "../components/ToolLayout";
import PDFToolClient from "../components/PDFToolClient";

export const metadata = { title: "Compress PDF - iLovePDF" };

export default function CompressPDF() {
  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while optimizing for maximal PDF quality."
      icon="🗜️"
      color="bg-gradient-to-br from-green-500 to-green-700"
    >
      <PDFToolClient
        apiEndpoint="/api/compress"
        accept=".pdf,application/pdf"
        multiple={false}
        buttonLabel="🗜️ Compress PDF"
        processingLabel="Compressing PDF..."
        uploaderLabel="Select PDF file"
        uploaderIcon="📂"
        uploaderDescription="Upload a PDF file to compress and reduce its size"
        downloadName="compressed.pdf"
      />
    </ToolLayout>
  );
}
