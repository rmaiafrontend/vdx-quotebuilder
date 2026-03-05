import { Bell } from 'lucide-react';

export default function PublicHeader({ company, primaryColor, rightSlot }) {
    return (
        <header
            className="px-5 py-4 flex items-center justify-between shadow-lg"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
        >
            <div className="flex items-center gap-3">
                {company?.logo_url ? (
                    <img
                        src={company.logo_url}
                        alt={company.name}
                        className="w-10 h-10 rounded-xl bg-white p-1 object-cover shadow-md ring-2 ring-white/30"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-md">
                        <span className="font-bold text-lg text-white">
                            {company?.name?.charAt(0) || 'V'}
                        </span>
                    </div>
                )}
                <div>
                    <h1 className="text-white font-bold text-lg tracking-tight leading-tight">
                        {company?.name || 'Orçamentos'}
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {rightSlot || (
                    <button className="relative p-2.5 hover:bg-white/15 rounded-xl transition-colors">
                        <Bell className="w-5 h-5 text-white/90" />
                    </button>
                )}
            </div>
        </header>
    );
}
