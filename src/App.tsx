
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Paiols from "./pages/Paiols";
import Pessoal from "./pages/Pessoal";
import PaiolDetails from "./pages/PaiolDetails";
import TiposInsumos from "./pages/TiposInsumos";
import Clientes from "./pages/Clientes";
import Caminhoes from "./pages/Caminhoes";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Relatorios from './pages/Relatorios';
import Equipamentos from './pages/Equipamentos';
import EquipamentoDetails from './pages/EquipamentoDetails';
import EmpresasMetanicas from './pages/EmpresasMetanicas';
import TiposManutencao from './pages/TiposManutencao';
import Configuracoes from './pages/Configuracoes';
import GerenciamentoUsuarios from './pages/GerenciamentoUsuarios';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="paiol-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/paiols"
                element={
                  <ProtectedRoute>
                    <Paiols />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/paiols/:id"
                element={
                  <ProtectedRoute>
                    <PaiolDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pessoal"
                element={
                  <ProtectedRoute>
                    <Pessoal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tipos-insumos"
                element={
                  <ProtectedRoute>
                    <TiposInsumos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clientes"
                element={
                  <ProtectedRoute>
                    <Clientes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/caminhoes"
                element={
                  <ProtectedRoute>
                    <Caminhoes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/equipamentos"
                element={
                  <ProtectedRoute>
                    <Equipamentos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/equipamentos/:id"
                element={
                  <ProtectedRoute>
                    <EquipamentoDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/empresas-mecanicas"
                element={
                  <ProtectedRoute>
                    <EmpresasMetanicas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tipos-manutencao"
                element={
                  <ProtectedRoute>
                    <TiposManutencao />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gerenciar-usuarios"
                element={
                  <ProtectedRoute>
                    <GerenciamentoUsuarios />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuracoes"
                element={
                  <ProtectedRoute>
                    <Configuracoes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/relatorios"
                element={
                  <ProtectedRoute>
                    <Relatorios />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
