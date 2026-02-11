import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH || "";

    const rawHash = adminHash.replace(/\\/g, "")       // Remove as barras \ se vierem do seu .env local
  .replace(/\$\$/g, "$")    // Transforma $$ em $ se vier do Vercel
  .replace(/['"]/g, "")     // Remove aspas
  .trim();
  

console.log("DEBUG - Hash limpo (caracteres):", rawHash?.length);
    if (email !== adminEmail) {
      return NextResponse.json(
        { error: "Credenciais inválidas!" },
        { status: 401 },
      );
    }

    const senhaValida = await bcrypt.compare(senha, rawHash);

    if (!senhaValida) {
        console.log("SENHA DIGITADA:", `|${senha}|`);
    console.log("HASH NO ENV:", `|${adminHash}|`);
      return NextResponse.json(
        { error: "Credenciais inválidas!" },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
