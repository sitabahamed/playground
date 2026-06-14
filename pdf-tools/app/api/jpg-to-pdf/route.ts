import { imagesToPDF } from "@/lib/pdf-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    if (files.length === 0) return Response.json({ error: "No files provided." }, { status: 400 });

    const buffers = await Promise.all(files.map(async (f) => Buffer.from(await f.arrayBuffer())));
    const mimeTypes = files.map((f) => f.type || "image/jpeg");

    const pdf = await imagesToPDF(buffers, mimeTypes);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="images.pdf"',
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to convert images to PDF." }, { status: 500 });
  }
}
