'use client'
import Link from 'next/link'
import { Instagram, Facebook, Phone, MapPin, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#fce00f] py-2 border-t border-black/10">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-2 ">
        
        <div className='flex flex-row gap-5 lg:gap-10 items-stretch'>
            {/* 1. Logo e Slogan */}
            <div className="flex flex-col justify-between flex-1 min-w-[127px] lg:justify-center">
              <Link
                href="/"
                className="font-realist text-2xl md:text-3xl text-black tracking-tighter text-center "
              >
                SUSHI MAKETTO <span className="text-sm font-sans align-top">®</span>
              </Link>
              <p className="text-black/80 text-[10px] uppercase tracking-[0.5em] font-bold text-center">
                Tradicional & Moderno
              </p>
            </div>
            {/* 2. Contactos (Estilo da imagem amarela) */}
            <div className="flex flex-col gap-3 text-black font-bold text-sm">
              <div className="flex items-center gap-3">
                <div className="bg-black p-1.5 text-[#fce00f]">
                  <Phone size={16} fill="currentColor" />
                </div>
                <span className="tracking-tighter">258 101 433</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-black p-1.5 text-[#fce00f]">
                  <MapPin size={16} fill="currentColor" />
                </div>
                <span className="text-[11px] leading-tight uppercase tracking-tight">
                  Mercado Municipal, Nº73 <br /> 4990-110 Ponte de Lima
                </span>
              </div>
            </div>
        </div>

        {/* 3. Redes Sociais (Estilo quadrados amarelos com ícone preto) */}
        <div className="flex gap-4">
          <Link href="https://instagram.com/teulink" target="_blank" className="bg-black p-2 text-[#fce00f] hover:scale-110 transition-transform">
            <Instagram size={20} />
          </Link>
          <Link href="https://pinterest.com/teulink" target="_blank" className="bg-black p-2 text-[#fce00f] hover:scale-110 transition-transform">
            <Youtube size={20} /> {/* Usei Youtube pois o Pinterest da imagem segue o mesmo padrão de caixa preta */}
          </Link>
          <Link href="https://facebook.com/teulink" target="_blank" className="bg-black p-2 text-[#fce00f] hover:scale-110 transition-transform">
            <Facebook size={20} fill="currentColor" />
          </Link>
        </div>

        {/* 4. Copyright */}
        <div className="text-black/60 text-[9px] text-center md:text-right uppercase tracking-[0.2em] font-bold">
          <p>© 2014 Sushi Maketto.</p>
          <p>Todos os direitos reservados.</p>
        </div>

      </div>
    </footer>
  )
}