import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache';

// app/api/reservations/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventId, scheduledTime, guests } = body

    // 1. Buscar o evento e todas as reservas já feitas
    const evento = await prisma.evento.findUnique({
      where: { id: eventId },
      include: { reservas: true }
    })

    if (!evento) return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 })

    // 2. Calcular ocupação atual
    const ocupacaoAtual = evento.reservas.reduce((acc, res) => acc + res.quantidadePessoas, 0)
    
    // 3. Verificar se a nova reserva excede a capacidade
    if (ocupacaoAtual + guests > evento.totalCapacity) {
      const vagasRestantes = evento.totalCapacity - ocupacaoAtual
      return NextResponse.json(
        { error: `Desculpe, restam apenas ${vagasRestantes} vagas para este evento.` }, 
        { status: 400 }
      )
    }

    // 4. Verificar se o horário específico já está tomado (sua regra anterior)
    const slotOcupado = evento.reservas.find(r => r.horario === scheduledTime)
    if (slotOcupado) {
      return NextResponse.json({ error: "Este horário já foi reservado." }, { status: 400 })
    }

    // Se passou em tudo, cria a reserva
    const reservation = await prisma.reserva.create({
      data: {
        nome: body.name,
        telefone: body.phone,
        email: body.email,
        quantidadePessoas: guests,
        eventoId: eventId,
        horario: scheduledTime,
      },
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}