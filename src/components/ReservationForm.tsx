'use client'

import { useState } from 'react'

export default function ReservationForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.currentTarget);
  
  // LOG DE SEGURANÇA: Abra o F12 no navegador e veja se o ID aparece aqui
  console.log("ID do Evento no Form:", eventId);

  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    guests: formData.get('guests'),
    eventId: eventId, // Certifique-se que esta variável 'eventId' (prop) não é nula
  };

  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.ok) {
  setSuccess(true)
} else {
  // Captura o erro da API (ex: "Só temos 2 vagas restantes")
  const errorData = await res.json()
  alert(errorData.error || "Erro ao realizar reserva")
}
  setLoading(false);
}

  if (success) return <p className="text-green-500 font-bold">Reserva realizada com sucesso! 🍣</p>

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
      <input name="name" placeholder="Seu nome" required className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white" />
      <input name="email" type="email" placeholder="Seu e-mail" required className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white" />
      <input name="phone" placeholder="Telefone (WhatsApp)" required className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white" />
      <input name="guests" type="number" min="1" placeholder="Número de pessoas" required className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white" />
      
      <button 
        type="submit" 
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-colors"
      >
        {loading ? 'Enviando...' : 'Confirmar Reserva'}
      </button>
    </form>
  )
}