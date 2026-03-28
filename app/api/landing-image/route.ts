import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

const imagePath =
  "C:/Users/usama/.cursor/projects/c-Users-usama-cusror/assets/c__Users_usama_AppData_Roaming_Cursor_User_workspaceStorage_798387b4fadd6398fcbe60f2004cec1e_images_image-df41175c-b731-473c-abca-d2313d1d8784.png";

export async function GET() {
  try {
    const imageBuffer = await readFile(imagePath);
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Landing background image not found." },
      { status: 404 },
    );
  }
}
