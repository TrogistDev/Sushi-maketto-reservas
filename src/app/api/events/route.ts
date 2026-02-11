import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// src/app/api/events/route.ts

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Log para depuração - verifique se 'availableSlots' aparece aqui no terminal
    console.log("Dados recebidos na API:", body)

    const newEvent = await prisma.evento.create({
      data: {
        titulo: body.titulo,
        descricao: body.descricao || null,
        data: new Date(body.data),
        local: body.local || "Sushi Maketto",
        totalCapacity: parseInt(body.totalCapacity), 
        imagemUrl: body.imagemUrl || null,
        active: true,
        // ADICIONE ESTA LINHA ABAIXO:
        availableSlots: body.availableSlots || [], 
      }
    })

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error: any) {
    console.error("ERRO NO PRISMA:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        reservas: {
          select: { quantidadePessoas: true }
        }
      },
      orderBy: { data: 'asc' }
    })
    return NextResponse.json(eventos)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 })
  }
}