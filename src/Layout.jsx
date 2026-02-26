import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { 
  Home, 
  FileText, 
  Settings, 
  Package, 
  LayoutGrid,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children, currentPageName }) {
  const [open, setOpen] = React.useState(false);
  
  // Páginas públicas sem layout
  if (currentPageName === 'OrcamentoPublico') {
    return <>{children}</>;
  }
  
  const menuItems = [
    { name: "Dashboard", icon: Home, page: "Dashboard" },
    { name: "Orçamentos", icon: FileText, page: "Orcamentos" },
    { name: "Tipologias", icon: Package, page: "Tipologias" },
    { name: "Categorias", icon: LayoutGrid, page: "Categorias" },
    { name: "Configurações", icon: Settings, page: "Configuracoes" },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50/80">
      {/* Header com logo */}
      <div className="shrink-0 px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25 ring-2 ring-white/50">
            <span className="text-white font-bold text-lg tracking-tight">V</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-lg text-slate-900 tracking-tight truncate">VDX</h1>
            <p className="text-xs text-slate-500 font-medium">Vidraçaria Digital</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <li key={item.page}>
                <Link
                  to={createPageUrl(item.page)}
                  onClick={() => setOpen(false)}
                  className={`
                    group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                    transition-all duration-200 ease-out
                    relative
                    ${isActive
                      ? "bg-blue-500/10 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-blue-500" aria-hidden />
                  )}
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive ? "bg-blue-500/15 text-blue-600" : "bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80"
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

      {/* Footer / CTA */}
      <div className="shrink-0 p-3 border-t border-slate-200/60 bg-white/50">
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/50 p-3.5 shadow-sm">
          <p className="text-sm font-medium text-slate-700">Precisa de ajuda?</p>
          <p className="text-xs text-slate-500 mt-0.5">Entre em contato com o suporte</p>
        </div>
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
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 ring-2 ring-white/50">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-slate-900">VDX</span>
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] max-w-[85vw] p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="lg:pl-[280px]">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}