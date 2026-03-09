import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  LayoutGrid,
  Menu,
  Wrench,
  ShoppingCart,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, VisuallyHidden } from "@/components/ui/sheet";
import { useAuth } from "@/lib/AuthContext";

/**
 * Layout para rotas privadas (admin/backoffice)
 * Inclui sidebar com menu de navegação
 */
export default function AdminLayout({ children }) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const menuItems = [
    { name: "Dashboard", icon: Home, page: "/admin/dashboard" },
    { name: "Tipologias", icon: Package, page: "/admin/tipologias" },
    { name: "Categorias", icon: LayoutGrid, page: "/admin/categorias" },
    { name: "Config. Técnicas", icon: Wrench, page: "/admin/configuracoes-tecnicas" },
    { name: "Produtos", icon: ShoppingCart, page: "/admin/produtos" },
  ];

  // Normalize pathname for active check
  const currentPath = location.pathname;

  const NavContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50/80">
      {/* Header com logo */}
      <div className="shrink-0 px-5 pt-6 pb-5">
        <img src="/vdx-logo.png" alt="Vidros Express" className="h-12 w-auto object-contain" />
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = currentPath === item.page ||
              (item.page === '/admin/dashboard' && currentPath === '/admin');
            return (
              <li key={item.page}>
                <Link
                  to={item.page}
                  onClick={() => setOpen(false)}
                  className={`
                    group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                    transition-all duration-200 ease-out
                    relative
                    ${isActive
                      ? "bg-[#1a3a8f]/10 text-[#1a3a8f] shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[#e8751a]" aria-hidden />
                  )}
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive ? "bg-[#1a3a8f]/15 text-[#1a3a8f]" : "bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80"
                  }`}>
                    <item.icon className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User + Logout */}
      <div className="shrink-0 p-3 border-t border-slate-200/60 bg-white/50 space-y-2">
        <div className="flex items-center gap-3 px-1">
          <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#1a3a8f] to-[#2962cc] flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold uppercase">
              {(user?.nome || 'A').split(' ').map(p => p[0]).slice(0, 2).join('')}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.nome || 'Admin'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'Administrador'}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-[280px] lg:flex-col">
        <div className="flex grow flex-col overflow-hidden border-r border-slate-200/80 bg-white shadow-[2px_0_24px_-8px_rgba(0,0,0,0.08)]">
          <NavContent />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/vdx-logo.png" alt="Vidros Express" className="h-10 w-auto object-contain" />
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] max-w-[85vw] p-0">
            <VisuallyHidden>
              <SheetTitle>Menu de navegação</SheetTitle>
            </VisuallyHidden>
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="lg:pl-[280px]">
        <div className="min-h-screen p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
