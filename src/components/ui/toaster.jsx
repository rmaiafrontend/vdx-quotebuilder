import { useToast } from "@/components/ui/use-toast";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANT_STYLES = {
  default: {
    container: "bg-white border-slate-200 text-slate-900",
    icon: Info,
    iconClass: "text-blue-500",
  },
  success: {
    container: "bg-white border-emerald-200 text-slate-900",
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
  },
  destructive: {
    container: "bg-white border-red-200 text-slate-900",
    icon: AlertCircle,
    iconClass: "text-red-500",
  },
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 sm:max-w-[400px] w-full pointer-events-none">
      {toasts.map((t) => {
        const v = VARIANT_STYLES[t.variant] || VARIANT_STYLES.default;
        const Icon = v.icon;
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto relative flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300",
              t.open
                ? "animate-in slide-in-from-bottom-4 fade-in-0"
                : "animate-out slide-out-to-right-full fade-out-0",
              v.container
            )}
          >
            <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", v.iconClass)} />
            <div className="flex-1 min-w-0">
              {t.title && (
                <p className="text-sm font-semibold leading-tight">{t.title}</p>
              )}
              {t.description && (
                <p className="text-sm text-slate-500 mt-0.5 leading-snug">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
