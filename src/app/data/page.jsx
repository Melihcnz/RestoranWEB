"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPlus, IconCircleFilled } from "@tabler/icons-react"
import api from "@/lib/api"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DataPage() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTable, setNewTable] = useState({
    number: '',
    capacity: '',
    section: 'iç mekan'
  })

  const fetchTables = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/tables')
      const tablesData = response.data.data || response.data || []
      setTables(Array.isArray(tablesData) ? tablesData : [])
    } catch (error) {
      console.error('Masalar yüklenirken hata:', error)
      toast.error('Masalar yüklenirken bir hata oluştu')
      setTables([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTable(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name, value) => {
    setNewTable(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Postman'deki formata göre veriyi hazırla
      const tableData = {
        number: parseInt(newTable.number),
        name: `Masa ${newTable.number}`,
        capacity: parseInt(newTable.capacity),
        section: newTable.section,
        status: 'boş',
        active: true,
        qrCode: ''
      }

      console.log('Gönderilen veri:', tableData) // Debug için

      const response = await api.post('/api/tables', tableData)
      
      if (response.data) {
        toast.success('Masa başarıyla eklendi')
        setIsModalOpen(false)
        setNewTable({
          number: '',
          capacity: '',
          section: 'iç mekan'
        })
        fetchTables()
      }
    } catch (error) {
      console.error('Masa eklenirken hata detayı:', error.response?.data) // Detaylı hata bilgisi
      if (error.response?.status === 401) {
        toast.error('Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.')
      } else if (error.response?.status === 400) {
        toast.error('Geçersiz veri formatı: ' + (error.response?.data?.message || 'Lütfen tüm alanları kontrol edin'))
      } else if (error.response?.status === 500) {
        toast.error('Sunucu hatası: Lütfen daha sonra tekrar deneyin')
      } else {
        toast.error('Masa eklenirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'))
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'müsait':
        return 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-400 dark:text-green-100'
      case 'occupied':
      case 'dolu':
        return 'bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-400 dark:text-red-100'
      case 'reserved':
      case 'rezerve':
        return 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-400 dark:text-yellow-100'
      default:
        return 'bg-gray-100 border-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
    }
  }

  const handleTableClick = (table) => {
    toast.info(`Masa ${table.number || table.tableNumber || 'Bilinmeyen'} seçildi`)
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
                  <h1 className="text-3xl font-bold tracking-tight">Masalar</h1>
                  <p className="text-muted-foreground mt-2">
                    Restoran masalarını görüntüleyin ve yönetin
                  </p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button>Yeni Masa Ekle</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Yeni Masa Ekle</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="number">Masa Numarası</Label>
                        <Input
                          id="number"
                          name="number"
                          type="number"
                          placeholder="Örn: 1"
                          value={newTable.number}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Kapasite</Label>
                        <Input
                          id="capacity"
                          name="capacity"
                          type="number"
                          placeholder="Örn: 4"
                          value={newTable.capacity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="section">Bölüm</Label>
                        <Select
                          value={newTable.section}
                          onValueChange={(value) => handleSelectChange('section', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Bölüm seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iç mekan">İç Mekan</SelectItem>
                            <SelectItem value="dış mekan">Dış Mekan</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="bar">Bar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full">
                        Masa Ekle
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 lg:px-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-muted-foreground">Masalar yükleniyor...</p>
                  </div>
                ) : tables.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-muted-foreground">Henüz masa bulunmuyor</p>
                  </div>
                ) : (
                  tables.map((table) => (
                    <Card 
                      key={table._id || table.id}
                      className={`p-4 cursor-pointer border-2 transition-all hover:scale-105 ${getStatusColor(table.status)}`}
                      onClick={() => handleTableClick(table)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Masa {table.number || table.tableNumber}</h3>
                        <IconCircleFilled className={`h-4 w-4`} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">Kapasite: {table.capacity || 'Belirtilmemiş'} kişi</p>
                        <p className="text-sm font-medium">
                          Durum: {
                            table.status === 'available' ? 'Müsait' :
                            table.status === 'occupied' ? 'Dolu' :
                            table.status === 'reserved' ? 'Rezerve' :
                            table.status || 'Belirsiz'
                          }
                        </p>
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