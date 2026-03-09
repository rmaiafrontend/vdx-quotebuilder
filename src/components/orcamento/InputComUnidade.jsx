import React from "react";
import { Input } from "@/components/ui/input";
import { converterParaMM } from "../utils/calculoUtils";
import ConversaoTempoReal from "./ConversaoTempoReal";

export default function InputComUnidade({
  label,
  nome,
  valor,
  unidade,
  unidadePadrao = "cm",
  permiteAlterarUnidade = true,
  onChange,
  placeholder
}) {
  const handleValorChange = (e) => {
    const novoValor = e.target.value === '' ? '' : parseFloat(e.target.value);
    onChange({ valor: novoValor, unidade });
  };

  const valorMM = valor !== '' && valor !== null ? converterParaMM(valor, unidade) : 0;
  const hasValue = valor !== '' && valor !== null && valor !== 0;

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 block">{label}</label>
      {unidade !== 'unidade' && <ConversaoTempoReal valorMM={valorMM} hasValue={hasValue} />}
      <div className="relative">
        <Input
          type="number"
          value={valor === '' ? '' : valor}
          onChange={handleValorChange}
          placeholder={placeholder || "0"}
          className="h-12 text-lg font-semibold border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-[#1a3a8f] focus:ring-[#1a3a8f]/20 pr-14 transition-all placeholder:text-slate-300 placeholder:font-normal"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md pointer-events-none uppercase tracking-wide">
          {unidade}
        </div>
      </div>
    </div>
  );
}
