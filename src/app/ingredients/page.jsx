'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"
import api from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchIngredients = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/ingredients')
      const ingredientsData = response.data.data || []
      setIngredients(Array.isArray(ingredientsData) ? ingredientsData : [])
    } catch (err) {
      console.error('Malzemeler yüklenirken hata:', err)
      toast.error('Malzemeler yüklenirken bir hata oluştu')
      setIngredients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [])

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '₺NaN'
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)"
      }}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Malzemeler</h1>
                  <p className="text-muted-foreground mt-2">
                    Restoran malzemelerini görüntüleyin ve yönetin
                  </p>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => toast.info('Yeni malzeme ekleme özelliği yakında!')}>
                  <IconPlus className="h-4 w-4" />
                  Yeni Malzeme Ekle
                </Button>
              </div>
              
              <div className="px-4 lg:px-6">
                <Card className="w-full overflow-hidden rounded-lg border bg-card">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-lg text-muted-foreground">Malzemeler yükleniyor...</p>
                    </div>
                  ) : ingredients.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-lg text-muted-foreground">Henüz malzeme bulunmuyor</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Malzeme Adı</TableHead>
                          <TableHead>Birim</TableHead>
                          <TableHead>Stok Durumu</TableHead>
                          <TableHead>Minimum Stok</TableHead>
                          <TableHead>Birim Fiyatı</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ingredients.map((ingredient) => (
                          <TableRow key={ingredient._id}>
                            <TableCell className="font-medium">{ingredient.name}</TableCell>
                            <TableCell>{ingredient.unit}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                ingredient.currentStock === 0 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100' 
                                  : ingredient.currentStock <= ingredient.minStockLevel
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-100'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100'
                              }`}>
                                {ingredient.currentStock} {ingredient.unit}
                              </span>
                            </TableCell>
                            <TableCell>{ingredient.minStockLevel} {ingredient.unit}</TableCell>
                            <TableCell>{formatPrice(ingredient.costPerUnit)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 