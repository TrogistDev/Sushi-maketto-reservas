'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [eventos, setEventos] = useState([])

  // Estados para os checkboxes de horários
  const [lunchSlots, setLunchSlots] = useState<string[]>([])
  const [dinnerSlots, setDinnerSlots] = useState<string[]>([])

  // Função auxiliar para gerar horários de 15 em 15 min
  const generateSlots = (start: number, end: number) => {
    const slots = []
    for (let hour = start; hour < end; hour++) {
      for (let min = 0; min < 60; min += 15) {
        slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`)
      }
    }
    if (end === 16) slots.push("16:00") // Limite do almoço
    if (end === 23) slots.push("23:00") // Limite do jantar
    return slots
  }

  const allLunchTimes = generateSlots(12, 16)
  const allDinnerTimes = generateSlots(18, 23)

  const toggleSlot = (slot: string, type: 'lunch' | 'dinner') => {
    if (type === 'lunch') {
      setLunchSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot])
    } else {
      setDinnerSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot])
    }
  }

  const toggleAll = (type: 'lunch' | 'dinner', checked: boolean) => {
    if (type === 'lunch') setLunchSlots(checked ? allLunchTimes : [])
    else setDinnerSlots(checked ? allDinnerTimes : [])
  }

  async function handleCreateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (lunchSlots.length === 0 && dinnerSlots.length === 0) {
      toast.error("Selecione pelo menos um horário em um dos turnos!")
      return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const eventData = {
      titulo: formData.get('titulo'),
      descricao: formData.get('descricao'),
      data: new Date(formData.get('data') as string).toISOString(),
      totalCapacity: Number(formData.get('totalCapacity')),
      local: formData.get('local'),
      // Enviamos os horários selecionados para o backend
      availableSlots: [...lunchSlots, ...dinnerSlots]
    }

    const res = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      toast.success("Evento criado com sucesso!")
      e.currentTarget.reset()
      setLunchSlots([])
      setDinnerSlots([])
      fetchEvents()
    }
    setLoading(false)
  }

  async function fetchEvents() {
    const res = await fetch('/api/events')
    const data = await res.json()
    setEventos(data)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza?")) return
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
    if (res.ok) fetchEvents()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
      
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 w-full max-w-4xl mb-12">
        <h2 className="text-xl mb-4 text-red-500 font-semibold">Criar Novo Evento</h2>
        
        <form onSubmit={handleCreateEvent} className="grid gap-6">
          {/* Campos Básicos */}
          <div className="grid gap-4">
            <input name="titulo" placeholder="Título do Evento" required className="p-2 bg-zinc-800 rounded outline-none focus:ring-1 ring-red-500" />
            <textarea name="descricao" placeholder="Descrição (Opcional)" className="p-2 bg-zinc-800 rounded h-20" />
            
            <div className="grid grid-cols-2 gap-4">
              <input name="data" type="date" required className="p-2 bg-zinc-800 rounded" />
              <input name="totalCapacity" type="number" placeholder="Capacidade total" required className="p-2 bg-zinc-800 rounded" />
            </div>
            <input name="local" placeholder="Local" defaultValue="Sushi Maketto" className="p-2 bg-zinc-800 rounded" />
          </div>

          <hr className="border-zinc-800" />

          {/* Seleção de Horários */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Almoço */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-orange-400">Almoço (12h - 16h)</h3>
                <label className="text-xs flex items-center gap-2 cursor-pointer bg-zinc-800 px-2 py-1 rounded">
                  <input type="checkbox" onChange={(e) => toggleAll('lunch', e.target.checked)} />
                  Todos
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {allLunchTimes.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleSlot(time, 'lunch')}
                    className={`text-xs p-1 rounded border ${lunchSlots.includes(time) ? 'bg-orange-500 border-orange-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Jantar */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-indigo-400">Jantar (18h - 23h)</h3>
                <label className="text-xs flex items-center gap-2 cursor-pointer bg-zinc-800 px-2 py-1 rounded">
                  <input type="checkbox" onChange={(e) => toggleAll('dinner', e.target.checked)} />
                  Todos
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {allDinnerTimes.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleSlot(time, 'dinner')}
                    className={`text-xs p-1 rounded border ${dinnerSlots.includes(time) ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 py-3 font-bold rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Publicando...' : 'Publicar Evento 🍣'}
          </button>
        </form>
      </div>

      {/* Lista de Eventos */}
      <section className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Eventos Ativos</h2>
        <div className="grid gap-4">
          {eventos.map((evento: any) => (
            <div key={evento.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex justify-between items-center hover:border-zinc-700 transition-all">
              <div>
                <h3 className="text-lg font-bold">{evento.titulo}</h3>
                <p className="text-zinc-500 text-sm">{new Date(evento.data).toLocaleDateString('pt-BR')}</p>
                <p className="text-zinc-400 text-xs">Capacidade: {evento.totalCapacity} lugares</p>
              </div>
              <button 
                onClick={() => handleDelete(evento.id)}
                className="bg-zinc-800 hover:bg-red-900/40 text-red-500 p-2 rounded-lg border border-red-900/20 transition-colors"
              >
                🗑️ Excluir
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}