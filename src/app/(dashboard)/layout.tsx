"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-xl text-blue-600">Clausify</span>
        <button
          onClick={() => {
  localStorage.removeItem("access_token")
  Cookies.remove("access_token")
  window.location.href = "/login"
}}
          className="text-sm text-slate-500 hover:text-slate-800 transition"
        >
          Déconnexion
        </button>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}