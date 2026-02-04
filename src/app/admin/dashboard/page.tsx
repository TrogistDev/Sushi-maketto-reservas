'use client'
import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [eventos, setEventos] = useState([])
  

  async function handleCreateEvent(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const eventData = {
      titulo: formData.get('titulo'),
      descricao: formData.get('descricao'),
      data: new Date(formData.get('data') as string).toISOString(),
      totalCapacity: formData.get('totalCapacity'), // Adicione esta linha
    local: formData.get('local'),
    }

    const res = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      alert("Evento criado com sucesso!")
      e.currentTarget.reset()
    }
    setLoading(false)
  }

  // Função para buscar eventos
  async function fetchEvents() {
    const res = await fetch('/api/events') // Precisaremos criar o GET na API (passo 3)
    const data = await res.json()
    setEventos(data)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Função para deletar
  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar este evento? Todas as reservas ligadas a ele serão apagadas.")) return

    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
    if (res.ok) {
      alert("Evento removido!")
      fetchEvents() // Atualiza a lista
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 flex justify-center items-center flex-col">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
      
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 max-w-2xl">
        <h2 className="text-xl mb-4 text-red-500 font-semibold">Criar Novo Evento</h2>
        <form onSubmit={handleCreateEvent} className="grid gap-4">
  <input name="titulo" placeholder="Título do Evento" required className="p-2 bg-zinc-800 rounded" />
  
  <textarea name="descricao" placeholder="Descrição (Opcional)" className="p-2 bg-zinc-800 rounded h-24" />
  
  <div className="grid grid-cols-2 gap-4">
    <input name="data" type="datetime-local" required className="p-2 bg-zinc-800 rounded" />
    <input name="totalCapacity" type="number" placeholder="Capacidade (ex: 30)" required className="p-2 bg-zinc-800 rounded" />
  </div>

  <input name="local" placeholder="Local (ex: Unidade Matriz)" defaultValue="Sushi Maketto" className="p-2 bg-zinc-800 rounded" />
  
  <button type="submit" className="bg-green-600 hover:bg-green-700 py-3 font-bold rounded transition-colors">
    Publicar Evento 🍣
  </button>
</form>
      </div>
      {/* LISTA DE EVENTOS CRIADOS */}
      <section className="max-w-4xl">
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
          {eventos.length === 0 && <p className="text-zinc-600">Nenhum evento cadastrado.</p>}
        </div>
      </section>
    </div>
  )
}