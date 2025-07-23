import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ProductCard } from "@/components/Products/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Plus,
  Filter,
  Search 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product, DashboardStats, User } from "@/types";

// Mock data - será substituído por dados reais do Supabase
const mockUser: User = {
  uid: "1",
  name: "João Silva",
  email: "joao@example.com",
  type: "affiliate",
  createdAt: new Date(),
};

const mockStats: DashboardStats = {
  totalClicks: 1234,
  totalConversions: 89,
  totalEarnings: 2567.89,
  activeProducts: 12,
  conversionRate: 7.2,
};

const mockProducts: Product[] = [
  {
    id: "1",
    creatorId: "creator1",
    title: "Curso de Marketing Digital",
    description: "Aprenda as melhores estratégias de marketing digital para alavancar seus negócios online.",
    affiliateLink: "https://exemplo.com/produto1",
    category: "Educação",
    commission: 30,
    materials: {
      instagram: ["post1.jpg", "story1.jpg"],
      tiktok: ["video1.mp4"],
      email: ["template1.html"],
      banners: ["banner1.jpg", "banner2.jpg"]
    },
    createdAt: new Date(),
    isActive: true,
    clickCount: 234,
    conversionCount: 18,
    price: 197.00
  },
  {
    id: "2",
    creatorId: "creator2",
    title: "E-book: Vendas no Digital",
    description: "Guia completo para aumentar suas vendas no ambiente digital.",
    affiliateLink: "https://exemplo.com/produto2",
    category: "E-book",
    commission: 50,
    materials: {
      instagram: ["post2.jpg"],
      tiktok: [],
      email: ["template2.html"],
      banners: ["banner3.jpg"]
    },
    createdAt: new Date(),
    isActive: true,
    clickCount: 89,
    conversionCount: 12,
    price: 47.00
  }
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {mockUser.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            {mockUser.type === "affiliate" 
              ? "Aqui você encontra os melhores produtos para promover e maximizar suas comissões."
              : "Gerencie seus produtos e acompanhe o desempenho dos seus afiliados."
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Cliques"
            value={mockStats.totalClicks}
            description="Este mês"
            icon={BarChart3}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Conversões"
            value={mockStats.totalConversions}
            description="Este mês"
            icon={TrendingUp}
            variant="success"
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatsCard
            title="Ganhos Totais"
            value={`R$ ${mockStats.totalEarnings.toFixed(2)}`}
            description="Este mês"
            icon={DollarSign}
            variant="primary"
            trend={{ value: 15.3, isPositive: true }}
          />
          <StatsCard
            title="Taxa de Conversão"
            value={`${mockStats.conversionRate}%`}
            description="Média geral"
            icon={Users}
            trend={{ value: 2.1, isPositive: true }}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">
              {mockUser.type === "affiliate" ? "Produtos Disponíveis" : "Meus Produtos"}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="materials">Materiais</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {mockUser.type === "affiliate" ? "Produtos para Promover" : "Seus Produtos"}
                  </CardTitle>
                  {mockUser.type === "creator" && (
                    <Button className="bg-gradient-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userType={mockUser.type}
                  affiliateId={mockUser.uid}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? "Nenhum produto encontrado com os filtros aplicados."
                      : "Nenhum produto disponível no momento."
                    }
                  </div>
                  {mockUser.type === "creator" && (
                    <Button className="bg-gradient-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Produto
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Detalhado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  📊 Gráficos e análises detalhadas serão implementados aqui.
                  <br />
                  Incluirá métricas de performance, tendências e insights.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Central de Materiais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  🎨 Biblioteca de materiais promocionais será implementada aqui.
                  <br />
                  Templates, banners, scripts e conteúdo pronto para usar.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}