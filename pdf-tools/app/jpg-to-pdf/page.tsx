import ToolLayout from "../components/ToolLayout";
import PDFToolClient from "../components/PDFToolClient";

export const metadata = { title: "JPG to PDF - iLovePDF" };

export default function JPGToPDF() {
  return (
    <ToolLayout
      title="JPG to PDF"
      description="Convert JPG images to PDF in seconds. Easily adjust orientation and margins."
      icon="📄"
      color="bg-gradient-to-br from-purple-500 to-purple-700"
    >
      <PDFToolClient
        apiEndpoint="/api/jpg-to-pdf"
        accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
        multiple={true}
        buttonLabel="📄 Convert to PDF"
        processingLabel="Converting images..."
        uploaderLabel="Select image files"
        uploaderIcon="🖼️"
        uploaderDescription="Upload JPG or PNG images to combine into a PDF"
        downloadName="images.pdf"
      />
    </ToolLayout>
  );
}
