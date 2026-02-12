// src/app/page.tsx
import { prisma } from "@/lib/prisma";
import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/footer";

export const dynamic = 'force-dynamic';
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
    <div className="relative h-screen w-full flex flex-col overflow-hidden" >
    <Navbar/>

    <main className=" relative h-screen text-white p-8 overflow-hidden">
      {/* IMAGEM DE FUNDO GLOBAL */}
      <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden">
        <Image
          src="/background.webp" 
          alt="Background Sushi Maketto"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay para garantir que o texto seja legível sobre a foto */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <h1 className="text-5xl font-bold text-center mb-12 mt-12 text-[white] tracking-tighter">
        RESERVA TUA MESA 
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
    <Footer/>
    </div>
  );
}