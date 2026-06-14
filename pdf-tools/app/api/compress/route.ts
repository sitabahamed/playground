import { compressPDF } from "@/lib/pdf-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return Response.json({ error: "No file provided." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const compressed = await compressPDF(buffer);

    return new Response(new Uint8Array(compressed), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="compressed.pdf"',
        "X-Original-Size": String(buffer.length),
        "X-Compressed-Size": String(compressed.length),
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to compress PDF." }, { status: 500 });
  }
}
