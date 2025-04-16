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
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/categories')
      const categoriesData = response.data.data || response.data || []
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error)
      toast.error('Kategoriler yüklenirken bir hata oluştu')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/api/categories/${id}`)
        toast.success('Kategori başarıyla silindi')
        fetchCategories() // Listeyi yenile
      } catch (error) {
        console.error('Kategori silinirken hata:', error)
        toast.error('Kategori silinirken bir hata oluştu')
      }
    }
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
                  <h1 className="text-3xl font-bold tracking-tight">Kategoriler</h1>
                  <p className="text-muted-foreground mt-2">
                    Ürün kategorilerini görüntüleyin ve yönetin
                  </p>
                </div>
                <Button onClick={() => toast.info('Yeni kategori ekleme özelliği yakında!')}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Yeni Kategori Ekle
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 lg:px-6">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center h-64">
                    <p className="text-lg text-muted-foreground">Kategoriler yükleniyor...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center h-64">
                    <p className="text-lg text-muted-foreground">Henüz kategori bulunmuyor</p>
                  </div>
                ) : (
                  categories.map((category) => (
                    <Card 
                      key={category._id}
                      className="p-4 cursor-pointer border-2 transition-all hover:scale-105 dark:border-gray-800 hover:shadow-lg"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.description || 'Açıklama bulunmuyor'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.info('Düzenleme özelliği yakında!')}
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(category._id)}
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                            {category.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 