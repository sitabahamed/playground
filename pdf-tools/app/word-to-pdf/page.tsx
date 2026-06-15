import ToolLayout from "../components/ToolLayout";
import PDFToolClient from "../components/PDFToolClient";

export const metadata = { title: "Word to PDF - iLovePDF" };

export default function WordToPDF() {
  return (
    <ToolLayout
      title="Word to PDF"
      description="Make DOC and DOCX files easy to read by converting them to PDF."
      icon="📝"
      color="bg-gradient-to-br from-indigo-500 to-indigo-700"
    >
      <PDFToolClient
        apiEndpoint="/api/word-to-pdf"
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={false}
        buttonLabel="📝 Convert to PDF"
        processingLabel="Converting document..."
        uploaderLabel="Select Word file"
        uploaderIcon="📝"
        uploaderDescription="Upload a .doc or .docx file to convert to PDF"
        downloadName="converted.pdf"
      />
    </ToolLayout>
  );
}
