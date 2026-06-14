import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

export const runtime = "nodejs";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "word-to-pdf-"));
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return Response.json({ error: "No file provided." }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() || "docx";
    const inputPath = path.join(tmpDir, `input.${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    const libreOffice = ["libreoffice", "libreoffice7.6", "soffice"].find(async (cmd) => {
      try { await execAsync(`which ${cmd}`); return true; } catch { return false; }
    });

    if (!libreOffice) {
      return Response.json({ error: "LibreOffice is not installed on this server." }, { status: 503 });
    }

    await execAsync(`${libreOffice} --headless --convert-to pdf "${inputPath}" --outdir "${tmpDir}"`);

    const outputPath = path.join(tmpDir, `input.pdf`);
    const pdfBuffer = await fs.readFile(outputPath);

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to convert document to PDF." }, { status: 500 });
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
