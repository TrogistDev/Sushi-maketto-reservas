"use client";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="relative w-full z-50">
      {/* 1. h-[80px] no mobile e h-[120px] no desktop para uma altura fixa e limpa.
          2. w-full garante que a barra ocupe a largura inteira da tela.
      */}
      <div className="relative w-full h-[80px] md:h-[100px] lg:h-[120px]">
        {/* Imagem de Fundo */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/navbarlg.webp"
            alt="Navbar Background"
            fill
            priority
            quality={100} // Define a qualidade máxima (0-100)
    unoptimized={true} // Opcional: Desativa completamente o processamento do Next.js
            // w-full e object-cover forçam a imagem a cobrir a largura toda.
            // object-bottom garante que o detalhe de baixo (a onda) fique visível.
            className="object-fit object-bottom"
          />
        </div>

        {/* Conteúdo (Logo e Links) */}
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">
          <Link
            href="/"
            className="text-4xl md:text-5xl font-realist text-black tracking-tight drop-shadow-md flex items-start"
          >
            Sushi Maketto
            <span className="text-xs md:text-sm font-sans align-top ml-1 mt-1">
              ®
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
