"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface EventData {
  id: string;
  availableSlots: string[]; // Horários vindo do banco (ex: ["12:00", "12:15"...])
  totalCapacity: number;
}

export default function ReservationForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // 1. Buscar os detalhes do evento (especialmente os horários disponíveis)
  useEffect(() => {
    async function getEventDetails() {
      const res = await fetch(`/api/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEventData(data);
      }
    }
    if (eventId) getEventDetails();
  }, [eventId]);



  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  // Validação dos Termos
  if (!acceptedTerms) {
    toast.error("Talvez precisaremos entrar em contato para confirmar sua reserva. Por favor, aceite os termos para continuar. Assim podemos ter acesso aos seus dados.");
    return;
  }

  if (!selectedSlot) {
    toast.error("Por favor, selecione um horário para sua reserva.");

    return;
  }

  setLoading(true);
  const formData = new FormData(e.currentTarget);
  
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    guests: Number(formData.get("guests")),
    eventId: eventId,
    scheduledTime: selectedSlot,
  };

  const res = await fetch(`/api/reservas/${eventId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    setSuccess(true);
    toast.success("Reserva realizada com sucesso!");
  } else {
    const errorData = await res.json();
    toast.error(errorData.error || "Erro ao realizar reserva");
  }
  setLoading(false);
}

  if (success)
    return (
      <div className="bg-green-900/20 border border-green-500 p-6 rounded-lg text-center">
        <p className="text-green-500 font-bold text-xl">
          Reserva realizada com sucesso! 🍣
        </p>
        <p className="text-zinc-400 text-sm mt-2">
          Esperamos por você às {selectedSlot}.
        </p>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-2xl"
    >
      <div className="space-y-4">
        <h3 className="text-white font-semibold mb-2">Seus Dados</h3>
        <input
          name="name"
          placeholder="Nome completo"
          required
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 ring-red-500 transition-all"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            required
            className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
          />
          <input
            name="phone"
            placeholder="WhatsApp (com DDD)"
            required
            className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
          />
        </div>

        <input
          name="guests"
          type="number"
          min="1"
          placeholder="Quantas pessoas?"
          required
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
        />
      </div>

      {/* SEÇÃO DE HORÁRIOS ATUALIZADA */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Escolha o Horário</h3>
        {eventData?.availableSlots ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center justify-center gap-2 max-h-48 overflow-y-auto p-2 border border-zinc-800 rounded-lg bg-zinc-950/50">
            {eventData.availableSlots.map((slot) => {
              // Verifica se este horário específico já está na lista de ocupados
              const isTaken = occupiedSlots.includes(slot);

              return (
                <button
                  key={slot}
                  type="button"
                  // O segredo está aqui: o botão fica inativo se isTaken for true
                  disabled={isTaken}
                  onClick={() => setSelectedSlot(slot)}
                  className={` min-w-[43px] p-2 text-sm font-medium rounded-md transition-all border ${
                    isTaken
                      ? "bg-zinc-800/50 border-zinc-800 text-zinc-700 cursor-not-allowed" // Estilo quando RESERVADO
                      : selectedSlot === slot
                        ? "bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]" // Estilo SELECIONADO
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500" // Estilo DISPONÍVEL
                  }`}
                >
                  {isTaken ? "Reservado" : slot}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-zinc-500 text-sm italic">
            Carregando horários disponíveis...
          </p>
        )}
      </div>
      {/* SEÇÃO DE TERMOS E PRIVACIDADE */}
      <div className="flex items-start gap-3 px-1">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-500 focus:ring-offset-zinc-900"
          />
        </div>
        <label
          htmlFor="terms"
          className="text-xs text-zinc-400 leading-tight cursor-pointer select-none"
        >
          Li e concordo com a{" "}
          <span className="text-zinc-200 underline">
            Política de Privacidade
          </span>{" "}
          e autorizo o contato para confirmação da reserva via WhatsApp.
        </label>
      </div>

      <button
  type="submit"
  disabled={loading}
  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg"
>
  {loading ? "Processando..." : "Confirmar Reserva para " + (selectedSlot || "...")}
</button>

      <p className="text-zinc-500 text-[10px] text-center uppercase tracking-widest">
        Sushi Maketto • Reserva Instantânea
      </p>
    </form>
  );
}
