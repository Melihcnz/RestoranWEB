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
import api from "@/lib/api"
import { toast } from "sonner"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/products')
      const productsData = response.data.data || response.data || []
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error)
      toast.error('Ürünler yüklenirken bir hata oluştu')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100'
    } else if (stock < 10) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-100'
    } else {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100'
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
                  <h1 className="text-3xl font-bold tracking-tight">Ürünler</h1>
                  <p className="text-muted-foreground mt-2">
                    Restoran ürünlerini görüntüleyin ve yönetin
                  </p>
                </div>
                <Button onClick={() => toast.info('Yeni ürün ekleme özelliği yakında!')}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Yeni Ürün Ekle
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 lg:px-6">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center h-64">
                    <p className="text-lg text-muted-foreground">Ürünler yükleniyor...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center h-64">
                    <p className="text-lg text-muted-foreground">Henüz ürün bulunmuyor</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <Card 
                      key={product._id}
                      className="p-4 cursor-pointer border-2 transition-all hover:scale-105 dark:border-gray-800 hover:shadow-lg"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category?.name || 'Kategorisiz'}</p>
                          </div>
                          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStockStatus(product.stock)}`}>
                            Stok: {product.stock}
                          </span>
                          {product.isActive ? (
                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100 px-2 py-1 rounded-full">
                              Aktif
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                              Pasif
                            </span>
                          )}
                        </div>
                        
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        )}
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