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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Giriş Yap</CardTitle>
          <CardDescription>
            Hesabınıza giriş yapmak için e-posta ve şifrenizi kullanın
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                suppressHydrationWarning
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                suppressHydrationWarning
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
            <div className="text-sm text-center text-gray-500 dark:text-gray-400">
              Hesabınız yok mu?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Kayıt Ol
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 