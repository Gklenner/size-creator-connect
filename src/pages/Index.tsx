import { useState } from "react";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Simulação de estado de autenticação - será substituído pelo Supabase Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Para demonstração, permitir alternar entre Landing e Dashboard
  if (showDashboard || isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div>
      <Landing />
      
      {/* Debug controls - remover em produção */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <Button 
          onClick={() => setShowDashboard(true)}
          className="bg-gradient-primary shadow-glow"
          size="sm"
        >
          Ver Dashboard (Demo)
        </Button>
      </div>
    </div>
  );
};

export default Index;
