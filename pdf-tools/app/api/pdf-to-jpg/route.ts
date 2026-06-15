import { pdfToImages } from "@/lib/pdf-utils";
import { zipSync } from "fflate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const dpi = parseInt(formData.get("dpi") as string || "150", 10);
    if (!file) return Response.json({ error: "No file provided." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const images = await pdfToImages(buffer, dpi);

    if (images.length === 1) {
      return new Response(new Uint8Array(images[0]), {
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Disposition": 'attachment; filename="page-1.jpg"',
        },
      });
    }

    const zipFiles: Record<string, Uint8Array> = {};
    images.forEach((img, i) => {
      zipFiles[`page-${i + 1}.jpg`] = new Uint8Array(img);
    });

    const zipped = zipSync(zipFiles, { level: 1 });
    return new Response(zipped, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="pdf-images.zip"',
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to convert PDF to images." }, { status: 500 });
  }
}
