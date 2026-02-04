import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Definimos params como uma Promise
) {
  try {
    // AQUI ESTÁ O SEGREDO: precisamos dar await no params
    const { id } = await params;

    await prisma.evento.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Evento deletado' }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao deletar:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}