import { NextRequest, NextResponse } from "next/server";
import { subirFoto } from "@/lib/s3/upload";

// Forzamos que corra en el servidor de Node (no en el Edge)
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("foto") as File;

    if (!file) {
      return NextResponse.json({ error: "No se subió ninguna foto" }, { status: 400 });
    }

    // Validaciones
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Formato no permitido. Usa JPG, PNG o WEBP." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La foto es muy grande (Máx 5MB)" }, { status: 400 });
    }

    // Convertir a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Obtener extensión (jpg, png, etc)
    const extension = file.name.split('.').pop() || "jpg";

    // Subir a S3
    const key = await subirFoto({
      body: buffer,
      contentType: file.type,
      extension: extension
    });

    return NextResponse.json({ 
        message: "Foto subida con éxito",
        key: key 
    }, { status: 201 });

  } catch (error) {
    console.error("Error subiendo foto:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}