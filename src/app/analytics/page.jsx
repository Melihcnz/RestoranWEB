import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
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
                <h1 className="text-3xl font-bold tracking-tight">Analiz Paneli</h1>
                <p className="text-muted-foreground mt-2">
                  Detaylı analiz ve raporlama araçları
                </p>
              </div>
              
              <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Ziyaretçi İstatistikleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartAreaInteractive />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performans Metrikleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-sm font-medium">Toplam Görüntülenme</h3>
                          <p className="text-2xl font-bold">124,892</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-sm font-medium">Ortalama Süre</h3>
                          <p className="text-2xl font-bold">2.5 dk</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 