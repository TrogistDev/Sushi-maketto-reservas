import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const numPessoasNovas = Number(body.guests)

    // 1. Buscar o evento e as reservas atuais
    const evento = await prisma.evento.findUnique({
      where: { id: body.eventId },
      include: {
        reservas: {
          select: { quantidadePessoas: true }
        }
      }
    })

    if (!evento) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 })
    }

    // 2. Calcular ocupação atual
    const ocupacaoAtual = evento.reservas.reduce((acc, r) => acc + r.quantidadePessoas, 0)
    const vagasRestantes = evento.totalCapacity - ocupacaoAtual

    // 3. VALIDAR SE CABE
    if (numPessoasNovas > vagasRestantes) {
      return NextResponse.json(
        { error: `Desculpe, só temos ${vagasRestantes} vagas restantes.` }, 
        { status: 400 }
      )
    }

    // 4. Criar a reserva se passar na validação
    const reservation = await prisma.reserva.create({
      data: {
        nome: body.name,
        telefone: body.phone,
        email: body.email,
        quantidadePessoas: numPessoasNovas,
        eventoId: body.eventId,
        aceitaPromocoes: false,
      },
    })
    revalidatePath('/');

    return NextResponse.json(reservation, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}