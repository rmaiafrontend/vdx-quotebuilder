import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, senha);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a8f] via-[#17348a] to-[#122a6b]" />

        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />

        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 bg-[#3b6cf5]/20 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-[#e8751a]/10 rounded-full blur-[100px]" />

        <div className="relative flex flex-col justify-between p-10 xl:p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.12] backdrop-blur-sm flex items-center justify-center border border-white/[0.06]">
              <span className="text-white text-[15px] font-bold tracking-tighter">V</span>
            </div>
            <div>
              <p className="text-[16px] font-semibold text-white tracking-tight">Vidros Express</p>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.15em]">Admin</p>
            </div>
          </div>

          <div>
            <h1 className="text-[32px] xl:text-[38px] font-semibold text-white leading-[1.15] tracking-tight">
              Configure o
              <br />
              catálogo com
              <br />
              <span className="text-[#e8751a]">agilidade.</span>
            </h1>
            <p className="text-[14px] text-white/40 mt-4 max-w-[320px] leading-relaxed">
              Gerencie tipologias, variáveis, peças e vidros para que os orçamentos sejam gerados com precisão.
            </p>
          </div>

          <p className="text-[11px] text-white/20">
            © {new Date().getFullYear()} Vidros Express. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center bg-[#f5f5f7] p-6 sm:p-8">
        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-[#1a3a8f] flex items-center justify-center">
              <span className="text-white text-sm font-bold tracking-tighter">V</span>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#0f0f12] tracking-tight">Vidros Express</p>
              <p className="text-[10px] font-medium text-[#0f0f12]/25 uppercase tracking-[0.15em]">Admin</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-[24px] font-semibold text-[#0f0f12] tracking-tight">
              Painel administrativo
            </h2>
            <p className="text-[14px] text-[#0f0f12]/40 mt-1">
              Entre com suas credenciais para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200/60 text-[13px] text-red-600 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-[13px] font-medium text-[#0f0f12]/60">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vidrosexpress.com"
                required
                autoFocus
                className="w-full h-11 px-4 rounded-xl border border-[#0f0f12]/[0.08] bg-white text-[14px] text-[#0f0f12] placeholder:text-[#0f0f12]/20 focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]/20 focus:border-[#1a3a8f]/30 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="senha" className="block text-[13px] font-medium text-[#0f0f12]/60">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-[#0f0f12]/[0.08] bg-white text-[14px] text-[#0f0f12] placeholder:text-[#0f0f12]/20 focus:outline-none focus:ring-2 focus:ring-[#1a3a8f]/20 focus:border-[#1a3a8f]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-[#0f0f12]/25 hover:text-[#0f0f12]/50 hover:bg-[#0f0f12]/[0.04] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#1a3a8f] hover:bg-[#122a6b] text-white text-[14px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="lg:hidden text-[11px] text-[#0f0f12]/20 text-center mt-10">
            © {new Date().getFullYear()} Vidros Express
          </p>
        </div>
      </div>
    </div>
  );
}
