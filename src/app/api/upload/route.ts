import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const POST = async (req: NextRequest) => {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const publicDir = path.join(process.cwd(), "public/file-manager");

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filePath = path.join(publicDir, file.name);
  fs.writeFileSync(filePath, fileBuffer);

  return NextResponse.json({
    message: "File uploaded successfully",
    path: `/file-manager/${file.name}`,
  });
};
