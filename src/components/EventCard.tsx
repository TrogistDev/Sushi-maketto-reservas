// src/components/EventCard.tsx
'use client'
import { useState } from 'react'
import ReservationForm from './ReservationForm'

interface EventCardProps {
  id: string
  title: string
  description: string
  date: Date
  totalCapacity: number
  occupiedSeats: number
}

export default function EventCard({ id, title, description, date, totalCapacity, occupiedSeats }: EventCardProps) {
  const [showForm, setShowForm] = useState(false)
  const isFull = occupiedSeats >= totalCapacity
  const [hasPrefetched, setHasPrefetched] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-6 mb-4"
    onMouseEnter={() => {
    // Só faz o fetch se ainda não tiver feito
    if (!hasPrefetched) {
      console.log("Prefetching horários..."); // Apenas para você testar
      fetch(`/api/events/${id}`);
      setHasPrefetched(true); // Bloqueia novos fetches após o primeiro
    }
  }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-red-500 font-medium">
            {new Date(date).toLocaleString('pt-BR')}
          </p>
        </div>
        
        {/* INDICADOR DE LUGARES DISPONÍVEIS */}
        <div className="text-right">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${isFull ? 'bg-red-900/50 text-red-500' : 'bg-green-900/50 text-green-500'}`}>
            {occupiedSeats} / {totalCapacity} lugares
          </span>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest text-center">Ocupação</p>
        </div>
      </div>

      <p className="text-zinc-400 mb-6">{description}</p>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          disabled={isFull}
          className={`w-full font-bold py-3 rounded-lg transition-all ${
            isFull 
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isFull ? "ESGOTADO" : "Reservar Minha Mesa"}
        </button>
      ) : (
        <div className="mt-4 p-4 border-t border-zinc-800">
           <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-semibold">Dados da Reserva</h4>
            <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white text-sm">Cancelar</button>
          </div>
          <ReservationForm eventId={id} />
        </div>
      )}
    </div>
  )
}