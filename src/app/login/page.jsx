"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/lib/api"
import { toast } from "sonner"
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await authService.login(formData.email, formData.password)
      // Token'ı hem cookie'ye hem localStorage'a kaydediyoruz
      Cookies.set('token', data.token, { expires: 7 }) // 7 günlük cookie
      localStorage.setItem("token", data.token)
      toast.success("Giriş başarılı!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "Giriş yapılırken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1A1A1A] rounded-xl shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Giriş Yap</h1>
          <p className="text-sm text-[#8A8A8D]">
            Hesabınıza giriş yapmak için e-posta ve şifrenizi kullanın
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#8A8A8D]">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md text-white placeholder-[#6A6A6D] focus:outline-none focus:ring-2 focus:ring-[#3A3A3A] focus:border-transparent"
              required
              suppressHydrationWarning
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#8A8A8D]">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md text-white placeholder-[#6A6A6D] focus:outline-none focus:ring-2 focus:ring-[#3A3A3A] focus:border-transparent"
              required
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white font-medium rounded-lg transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-[#8A8A8D]">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-[#8A8A8D] hover:text-white font-medium">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 