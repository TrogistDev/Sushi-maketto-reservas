import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// BUSCAR UM EVENTO ESPECÍFICO (Usado no formulário do cliente)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const evento = await prisma.evento.findUnique({
      where: { id },
      // Trocamos o 'select' simples por um 'include' ou adicionamos as reservas ao select
      include: {
        reservas: {
          select: {
            horario: true // Trazemos apenas o horário das reservas para economizar dados
          }
        }
      }
    });

    if (!evento) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    return NextResponse.json(evento);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETAR EVENTO (Usado no painel admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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