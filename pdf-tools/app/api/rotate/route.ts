import { rotatePDF } from "@/lib/pdf-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const rotation = parseInt(formData.get("rotation") as string || "90", 10);
    if (!file) return Response.json({ error: "No file provided." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const rotated = await rotatePDF(buffer, rotation);

    return new Response(new Uint8Array(rotated), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rotated.pdf"',
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to rotate PDF." }, { status: 500 });
  }
}
