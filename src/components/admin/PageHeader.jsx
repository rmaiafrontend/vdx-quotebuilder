import React from "react";

/**
 * @param {string} title
 * @param {string} [description]
 * @param {React.ReactNode} [action]
 */
export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-slate-500 mt-1 text-sm">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
