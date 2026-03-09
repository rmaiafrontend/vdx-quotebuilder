import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Layers } from "lucide-react";

export default function CategoriaCard({ categoria, onClick, index, primaryColor = "#1a3a8f" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      onClick={onClick}
      className="group cursor-pointer relative overflow-hidden bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
        style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}88)` }}
      />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon/Image */}
          {categoria.imagem_url ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 ring-1 ring-slate-200/60 flex-shrink-0 shadow-sm">
              <img
                src={categoria.imagem_url}
                alt={categoria.nome}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)` }}
            >
              <Layers className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base group-hover:text-[#1a3a8f] transition-colors leading-tight">
              {categoria.nome}
            </h3>
            {categoria.descricao && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{categoria.descricao}</p>
            )}
          </div>

          {/* Arrow */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:translate-x-0.5"
            style={{ backgroundColor: `${primaryColor}08` }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: primaryColor }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
