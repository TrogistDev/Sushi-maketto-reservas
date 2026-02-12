import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// src/app/api/events/route.ts

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
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
        // Mantido: Salva o array de strings (ex: ["12:00", "12:15"])
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
        // ATUALIZADO: Agora buscamos todos os detalhes da reserva para o Dashboard
        reservas: {
          select: {
            id: true,
            nome: true,      // Nome completo do cliente
            telefone: true,  // Telefone de contacto
            horario: true,   // Janela de tempo reservada
            quantidadePessoas: true,
            email: true      // Adicionado por precaução
          }
        }
      },
      orderBy: { data: 'asc' }
    })
    return NextResponse.json(eventos)
  } catch (error) {
    console.error("Erro ao buscar eventos:", error)
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 })
  }
}