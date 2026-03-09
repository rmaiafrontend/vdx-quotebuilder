import React from "react";
import { converterDeMM } from "../utils/calculoUtils";

export default function ConversaoTempoReal({ valorMM, hasValue }) {
  const mm = valorMM != null && Number.isFinite(valorMM) && valorMM !== 0 ? Math.round(valorMM) : null;
  const cm = mm != null ? converterDeMM(valorMM, 'cm').toFixed(2) : null;
  const m = mm != null ? converterDeMM(valorMM, 'm').toFixed(2) : null;

  const items = [
    { label: 'mm', value: mm },
    { label: 'cm', value: cm },
    { label: 'm', value: m },
  ];

  return (
    <div className="flex items-center gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
            item.value != null
              ? 'bg-[#1a3a8f]/[0.06] text-[#1a3a8f]'
              : 'bg-slate-50 text-slate-400'
          }`}
        >
          <span className="font-medium uppercase">{item.label}</span>
          <span className="font-bold tabular-nums">{item.value ?? '—'}</span>
        </div>
      ))}
    </div>
  );
}
