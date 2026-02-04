// src/app/page.tsx
import { prisma } from "@/lib/prisma";
import EventCard from "@/components/EventCard";

export default async function Home() {
  const listaDeEventos = await prisma.evento.findMany({
    where: { active: true },
    include: {
      reservas: {
        select: {
          quantidadePessoas: true // Buscamos apenas os números para somar
        }
      }
    },
    orderBy: { data: 'asc' }
  });

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-red-600 italic">
        SUSHI MAKETTO
      </h1>

      <div className="max-w-4xl mx-auto grid gap-6">
        {listaDeEventos.length > 0 ? (
          listaDeEventos.map((evento) => {
            const totalPessoasReservadas = evento.reservas.reduce(
              (acc, reserva) => acc + (reserva.quantidadePessoas || 0), 
              0
            );

            return (
              <EventCard 
                key={evento.id}
                id={evento.id} 
                title={evento.titulo}
                description={evento.descricao ?? ""}
                date={evento.data}
                totalCapacity={evento.totalCapacity}
                occupiedSeats={totalPessoasReservadas}
              />
            );
          })
        ) : (
          /* MENSAGEM DE AVISO QUANDO NÃO HÁ EVENTOS */
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
            <h2 className="text-2xl font-semibold text-zinc-400">Nenhum evento disponível no momento</h2>
            <p className="text-zinc-600 mt-2">Fique atento às nossas redes sociais para próximas datas!</p>
            <div className="mt-6 text-4xl">🍣</div>
          </div>
        )}
      </div>
    </main>
  );
}