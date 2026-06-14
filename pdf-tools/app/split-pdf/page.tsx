import ToolLayout from "../components/ToolLayout";
import PDFToolClient from "../components/PDFToolClient";

export const metadata = { title: "Split PDF - iLovePDF" };

export default function SplitPDF() {
  return (
    <ToolLayout
      title="Split PDF"
      description="Separate one page or a whole set for easy conversion into independent PDF files."
      icon="✂️"
      color="bg-gradient-to-br from-orange-500 to-orange-700"
    >
      <PDFToolClient
        apiEndpoint="/api/split"
        accept=".pdf,application/pdf"
        multiple={false}
        buttonLabel="✂️ Split PDF"
        processingLabel="Splitting PDF..."
        uploaderLabel="Select PDF file"
        uploaderIcon="📂"
        uploaderDescription="Upload a PDF to split each page into individual files"
        downloadName="split-pages.zip"
      />
    </ToolLayout>
  );
}
