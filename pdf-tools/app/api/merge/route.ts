import { mergePDFs } from "@/lib/pdf-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    if (files.length < 2) {
      return Response.json({ error: "At least 2 PDF files are required." }, { status: 400 });
    }
    const buffers = await Promise.all(files.map(async (f) => Buffer.from(await f.arrayBuffer())));
    const merged = await mergePDFs(buffers);
    return new Response(new Uint8Array(merged), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to merge PDFs." }, { status: 500 });
  }
}
