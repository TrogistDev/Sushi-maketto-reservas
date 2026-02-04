'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock de login simples para você começar
    if (email === "maketto@gmail.com" && senha === "123") {
      localStorage.setItem("isLoggedIn", "true")
      router.push('/admin/dashboard')
    } else {
      alert("Credenciais inválidas!")
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