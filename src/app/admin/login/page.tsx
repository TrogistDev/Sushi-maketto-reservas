'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  const loadingToast = toast.loading("Autenticando...")

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    })

    const data = await res.json()

    if (res.ok) {
      toast.success("Login realizado!", { id: loadingToast })
      
      // SALVAR COOKIE (Dura 1 dia, por exemplo)
      // O Middleware agora conseguirá ler isso!
      document.cookie = "isLoggedIn=true; path=/; max-age=86400; SameSite=Strict";
      
      router.push('/admin/dashboard')
    } else {
      toast.error(data.error || "Erro ao entrar", { id: loadingToast })
    }
  } catch (error) {
    toast.error("Erro de conexão", { id: loadingToast })
  }
}
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Sushi Maketto</h2>
        <input 
          type="email" placeholder="E-mail" 
          className="w-full p-2 mb-4 bg-zinc-800 border border-zinc-700 text-white rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Senha" 
          className="w-full p-2 mb-6 bg-zinc-800 border border-zinc-700 text-white rounded"
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  )
}