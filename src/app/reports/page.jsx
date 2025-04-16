'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconHistory, IconReportAnalytics } from "@tabler/icons-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function ReportsPage() {
  const [stockReport, setStockReport] = useState([])
  const [stockHistory, setStockHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStockReport = async () => {
    try {
      const response = await api.get('/api/stock/report')
      const reportData = response.data.ingredients || []
      setStockReport(Array.isArray(reportData) ? reportData : [])
    } catch (error) {
      console.error('Stok raporu yüklenirken hata:', error)
      toast.error('Stok raporu yüklenirken bir hata oluştu')
      setStockReport([])
    }
  }

  const fetchStockHistory = async () => {
    try {
      const response = await api.get('/api/stock/history')
      const historyData = response.data.data || response.data || []
      setStockHistory(Array.isArray(historyData) ? historyData : [])
    } catch (error) {
      console.error('Stok geçmişi yüklenirken hata:', error)
      toast.error('Stok geçmişi yüklenirken bir hata oluştu')
      setStockHistory([])
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchStockReport(), fetchStockHistory()])
      setLoading(false)
    }
    fetchData()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold tracking-tight">Raporlar</h1>
                <p className="text-muted-foreground mt-2">
                  Stok raporları ve stok hareket geçmişi
                </p>
              </div>

              <div className="px-4 lg:px-6">
                <Tabs defaultValue="report" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="report" className="flex items-center gap-2">
                      <IconReportAnalytics className="h-4 w-4" />
                      Stok Raporu
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                      <IconHistory className="h-4 w-4" />
                      Stok Geçmişi
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="report">
                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-lg text-muted-foreground">Rapor yükleniyor...</p>
                      </div>
                    ) : stockReport.length === 0 ? (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-lg text-muted-foreground">Rapor bulunamadı</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {stockReport.map((item) => (
                          <Card 
                            key={item._id}
                            className="p-4 cursor-pointer border-2 transition-all hover:scale-105 dark:border-gray-800 hover:shadow-lg"
                          >
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {item.category || 'Kategorisiz'}
                                </p>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Mevcut Stok:</span>
                                <span className={`text-sm font-bold ${
                                  item.currentStock === 0 ? 'text-red-500' :
                                  item.currentStock < item.minStockLevel ? 'text-yellow-500' :
                                  'text-green-500'
                                }`}>
                                  {item.currentStock} {item.unit}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Min. Stok Seviyesi:</span>
                                <span className="text-sm text-muted-foreground">
                                  {item.minStockLevel} {item.unit}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Birim Maliyet:</span>
                                <span className="text-sm text-muted-foreground">
                                  {item.costPerUnit} ₺
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="history">
                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-lg text-muted-foreground">Geçmiş yükleniyor...</p>
                      </div>
                    ) : stockHistory.length === 0 ? (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-lg text-muted-foreground">Geçmiş bulunamadı</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stockHistory.map((item) => (
                          <Card 
                            key={item._id}
                            className="p-4 cursor-pointer border-2 transition-all hover:scale-105 dark:border-gray-800 hover:shadow-lg"
                          >
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold">{item.product?.name || 'Bilinmeyen Ürün'}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(item.date)}
                                </p>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Miktar:</span>
                                <span className={`text-sm font-bold ${
                                  item.type === 'decrease' ? 'text-red-500' : 'text-green-500'
                                }`}>
                                  {item.type === 'decrease' ? '-' : '+'}{item.quantity}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.description || 'Açıklama yok'}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 