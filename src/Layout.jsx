import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import {
  Home,
  FileText,
  Settings,
  Package,
  LayoutGrid,
  Menu,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";

const NAV = [
  { name: "Dashboard",     icon: Home,       page: "Dashboard" },
  { name: "Orçamentos",    icon: FileText,   page: "Orcamentos" },
  { name: "Tipologias",    icon: Package,    page: "Tipologias" },
  { name: "Categorias",    icon: LayoutGrid, page: "Categorias" },
  { name: "Configurações", icon: Settings,   page: "Configuracoes" },
];

const W_OPEN   = 252;
const W_CLOSED = 72;
const ICON_BOX = 44;

export default function Layout({ children, currentPageName }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Páginas públicas sem layout
  if (currentPageName === "OrcamentoPublico") {
    return <>{children}</>;
  }

  const c = collapsed;

  return (
    <div className="min-h-screen bg-[#f5f5f7]">

      {/* ── Desktop Sidebar ── */}
      <aside
        style={{ width: c ? W_CLOSED : W_OPEN }}
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:flex-col overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a8f] via-[#17348a] to-[#122a6b]" />
        <div className="pointer-events-none absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-white/[0.05] to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="relative flex flex-col h-full">

          {/* ─ Brand ─ */}
          <div className="shrink-0 h-16 flex items-center justify-center">
            <Link
              to={createPageUrl("Dashboard")}
              className="flex items-center gap-3 group"
              style={c ? undefined : { paddingLeft: 20, paddingRight: 20, width: "100%" }}
            >
              <div className="shrink-0 w-9 h-9 rounded-[10px] bg-white/[0.15] backdrop-blur-sm flex items-center justify-center border border-white/[0.08] group-hover:bg-white/[0.2] transition-colors">
                <span className="text-white text-sm font-bold tracking-tighter">V</span>
              </div>
              {!c && (
                <div className="overflow-hidden whitespace-nowrap">
                  <p className="text-[15px] font-semibold text-white tracking-tight">Vidros Express</p>
                  <p className="text-[10px] font-medium text-white/40 uppercase tracking-[0.15em]">Admin</p>
                </div>
              )}
            </Link>
          </div>

          {/* ─ Separator ─ */}
          <div className="h-px bg-white/[0.08]" style={{ margin: c ? "0 14px" : "0 20px" }} />

          {/* ─ Nav ─ */}
          <nav className="flex-1 overflow-y-auto py-5">
            {!c && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-3" style={{ paddingLeft: 24 }}>
                Navegação
              </p>
            )}

            <div
              className="flex flex-col gap-1"
              style={{ alignItems: c ? "center" : "stretch", padding: c ? "0" : "0 12px" }}
            >
              {NAV.map((item) => {
                const active = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className={`
                      group relative flex items-center rounded-xl transition-all duration-200 ease-out
                      ${active
                        ? "bg-white/[0.15] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                        : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
                      }
                    `}
                    style={c
                      ? { width: ICON_BOX, height: ICON_BOX, justifyContent: "center" }
                      : { height: ICON_BOX, paddingLeft: 14, paddingRight: 14, gap: 12 }
                    }
                    title={c ? item.name : undefined}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#e8751a]" />
                    )}
                    <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={active ? 2 : 1.5} />
                    {!c && <span className="text-[13px] font-medium truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ─ Bottom ─ */}
          <div className="shrink-0 pb-4">
            <div className="h-px bg-white/[0.08] mb-3" style={{ margin: c ? "0 14px 12px" : "0 14px 12px" }} />

            <div
              className="flex flex-col gap-1"
              style={{ alignItems: c ? "center" : "stretch", padding: c ? "0" : "0 12px" }}
            >
              <button
                onClick={() => setCollapsed(v => !v)}
                className="flex items-center rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-200"
                style={c
                  ? { width: ICON_BOX, height: 40, justifyContent: "center" }
                  : { height: 40, paddingLeft: 14, paddingRight: 14, gap: 12, width: "100%" }
                }
                title={c ? "Expandir" : undefined}
              >
                {c
                  ? <ChevronsRight className="w-4 h-4" strokeWidth={1.5} />
                  : <><ChevronsLeft className="w-4 h-4" strokeWidth={1.5} /><span className="text-[13px] font-medium">Recolher</span></>
                }
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <header className="lg:hidden sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-[#1a3a8f] border-b border-white/[0.08]">
        <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/[0.15] flex items-center justify-center border border-white/[0.08]">
            <span className="text-white text-[10px] font-bold">V</span>
          </div>
          <span className="text-sm font-semibold text-white">VDX Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden animate-in slide-in-from-left duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a8f] via-[#17348a] to-[#122a6b]" />
            <div className="pointer-events-none absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-white/[0.05] to-transparent" />

            <div className="relative flex flex-col h-full">
              <div className="h-14 flex items-center justify-between px-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.15] flex items-center justify-center border border-white/[0.08]">
                    <span className="text-white text-[10px] font-bold">V</span>
                  </div>
                  <span className="text-sm font-semibold text-white">VDX Admin</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mx-5 h-px bg-white/[0.08]" />

              <nav className="flex-1 py-5 px-3 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 px-3 mb-3">Navegação</p>
                {NAV.map((item) => {
                  const active = currentPageName === item.page;
                  return (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        relative flex items-center gap-3 rounded-xl h-11 px-3.5 text-[13px] font-medium
                        transition-all duration-200
                        ${active
                          ? "bg-white/[0.15] text-white"
                          : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
                        }
                      `}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#e8751a]" />
                      )}
                      <item.icon className="w-[18px] h-[18px]" strokeWidth={active ? 2 : 1.5} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* ── Main ── */}
      <main
        className="transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ paddingLeft: typeof window !== "undefined" && window.innerWidth >= 1024 ? (c ? W_CLOSED : W_OPEN) : 0 }}
      >
        <div className="min-h-screen p-5 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
