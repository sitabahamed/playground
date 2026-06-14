import { splitPDF } from "@/lib/pdf-utils";
import { zipSync } from "fflate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return Response.json({ error: "No file provided." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const pages = await splitPDF(buffer);

    const zipFiles: Record<string, Uint8Array> = {};
    pages.forEach((page, i) => {
      zipFiles[`page-${i + 1}.pdf`] = new Uint8Array(page);
    });

    const zipped = zipSync(zipFiles, { level: 6 });
    return new Response(zipped, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="split-pages.zip"',
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to split PDF." }, { status: 500 });
  }
}
