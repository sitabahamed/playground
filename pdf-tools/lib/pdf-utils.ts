import { PDFDocument, degrees } from "pdf-lib";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function mergePDFs(buffers: Buffer[]): Promise<Buffer> {
  const merged = await PDFDocument.create();
  for (const buf of buffers) {
    const pdf = await PDFDocument.load(buf);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  const bytes = await merged.save();
  return Buffer.from(bytes);
}

export async function splitPDF(buffer: Buffer): Promise<Buffer[]> {
  const pdf = await PDFDocument.load(buffer);
  const results: Buffer[] = [];
  for (let i = 0; i < pdf.getPageCount(); i++) {
    const single = await PDFDocument.create();
    const [page] = await single.copyPages(pdf, [i]);
    single.addPage(page);
    const bytes = await single.save();
    results.push(Buffer.from(bytes));
  }
  return results;
}

export async function rotatePDF(buffer: Buffer, rotation: number): Promise<Buffer> {
  const pdf = await PDFDocument.load(buffer);
  const pages = pdf.getPages();
  pages.forEach((page) => {
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + rotation) % 360));
  });
  const bytes = await pdf.save();
  return Buffer.from(bytes);
}

export async function compressPDF(buffer: Buffer): Promise<Buffer> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-compress-"));
  const inputPath = path.join(tmpDir, "input.pdf");
  const outputPath = path.join(tmpDir, "output.pdf");

  try {
    await fs.writeFile(inputPath, buffer);
    await execAsync(
      `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`
    );
    const result = await fs.readFile(outputPath);
    return result;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

export async function pdfToImages(buffer: Buffer, dpi = 150): Promise<Buffer[]> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-to-jpg-"));
  const inputPath = path.join(tmpDir, "input.pdf");

  try {
    await fs.writeFile(inputPath, buffer);
    await execAsync(
      `gs -sDEVICE=jpeg -dNOPAUSE -dBATCH -dQUIET -r${dpi} -sOutputFile="${tmpDir}/page-%03d.jpg" "${inputPath}"`
    );
    const files = (await fs.readdir(tmpDir))
      .filter((f) => f.startsWith("page-") && f.endsWith(".jpg"))
      .sort();

    const images = await Promise.all(
      files.map((f) => fs.readFile(path.join(tmpDir, f)))
    );
    return images;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

export async function imagesToPDF(imageBuffers: Buffer[], mimeTypes: string[]): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  for (let i = 0; i < imageBuffers.length; i++) {
    const mime = mimeTypes[i] || "image/jpeg";
    let img;
    if (mime === "image/png") {
      img = await pdf.embedPng(imageBuffers[i]);
    } else {
      img = await pdf.embedJpg(imageBuffers[i]);
    }
    const page = pdf.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
