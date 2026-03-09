import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, ShoppingCart, ClipboardList, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVidraceiro } from '@/lib/VidracerioContext';
import { useCarrinho } from '@/hooks/useCarrinho';

const tabs = [
  { path: '/', label: 'Início', icon: Home },
  { id: 'carrinho', label: 'Carrinho', icon: ShoppingCart },
  { path: '/orcamento', label: 'Novo', icon: PlusCircle, accent: true },
  { path: '/em-aberto', label: 'Pedidos', icon: ClipboardList },
];

export default function BottomNav({ primaryColor }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useVidraceiro();
  const { carrinho, isDrawerOpen, setDrawerOpen } = useCarrinho();
  const color = primaryColor || '#1a3a8f';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isCartTab = tab.id === 'carrinho';
          const isActive = isCartTab
            ? isDrawerOpen
            : tab.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(tab.path);
          const Icon = tab.icon;
          const badgeCount = isCartTab ? carrinho.length : 0;

          const handleClick = () => {
            if (isCartTab) {
              setDrawerOpen(!isDrawerOpen);
            } else {
              navigate(tab.path);
            }
          };

          if (tab.accent) {
            return (
              <button
                key={tab.path || tab.id}
                onClick={handleClick}
                className="flex flex-col items-center gap-0.5 -mt-4"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg text-white transition-transform active:scale-90"
                  style={{
                    background: `linear-gradient(135deg, #e8751a, #d4650f)`,
                    boxShadow: `0 4px 14px rgba(232, 117, 26, 0.4)`,
                  }}
                >
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-semibold text-[#e8751a]">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.path || tab.id}
              onClick={handleClick}
              className={cn(
                'relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors',
                isActive ? 'text-current' : 'text-slate-400'
              )}
              style={isActive ? { color } : undefined}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
                {badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                    {badgeCount}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-medium')}>
                {tab.label}
              </span>
              {isActive && (
                <div
                  className="w-1 h-1 rounded-full -mt-0.5"
                  style={{ backgroundColor: color }}
                />
              )}
            </button>
          );
        })}

        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl text-slate-400 transition-colors"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Sair</span>
        </button>
      </div>
    </nav>
  );
}
