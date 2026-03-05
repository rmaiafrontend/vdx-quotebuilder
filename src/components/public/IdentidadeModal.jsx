import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, User, Building2, FileText, ArrowRight, Shield } from 'lucide-react';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useVidraceiro } from '@/lib/VidracerioContext';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';
import { vidraceiroSchema } from '@/lib/vidraceiro-schema';
import { formatPhone, formatCPF, formatCNPJ } from '@/utils/docUtils';

export default function IdentidadeModal() {
  const { showModal, urlDefaults, identify } = useVidraceiro();
  const { company, primaryColor } = useCompanyTheme();

  const form = useForm({
    resolver: zodResolver(vidraceiroSchema),
    defaultValues: {
      phone: urlDefaults.phone ? formatPhone(urlDefaults.phone) : '',
      name: urlDefaults.name || '',
      docType: 'cpf',
      doc: '',
      companyName: '',
    },
  });

  const docType = form.watch('docType');
  const isCnpj = docType === 'cnpj';

  function handleDocTypeToggle(type) {
    if (type === docType) return;
    form.setValue('docType', type);
    form.setValue('doc', '');
    form.setValue('companyName', '');
    form.clearErrors('doc');
    form.clearErrors('companyName');
  }

  function onSubmit(data) {
    identify(data);
  }

  if (!showModal) return null;

  return (
    <DialogPrimitive.Root open={showModal}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-[420px] translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-300"
        >
          <div className="rounded-3xl bg-white shadow-2xl ring-1 ring-black/[0.06] overflow-hidden">
            {/* Header com gradiente */}
            <div
              className="relative px-6 pt-8 pb-6 overflow-hidden"
              style={{ background: `linear-gradient(160deg, ${primaryColor}, ${primaryColor}cc)` }}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
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
                  <span className="text-white/80 text-sm font-medium">{company?.name || 'Vidraçaria'}</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Confirme sua identidade
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  Preencha seus dados para acessar seus orçamentos.
                </p>
              </div>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            placeholder="(00) 00000-0000"
                            className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            {...field}
                            onChange={(e) => field.onChange(formatPhone(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            placeholder="Seu nome completo"
                            className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Toggle CPF / CNPJ */}
                <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => handleDocTypeToggle('cpf')}
                    className={cn(
                      'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200',
                      !isCnpj
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/[0.04]'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                  >
                    CPF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDocTypeToggle('cnpj')}
                    className={cn(
                      'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200',
                      isCnpj
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/[0.04]'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                  >
                    CNPJ
                  </button>
                </div>

                <FormField
                  control={form.control}
                  name="doc"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            placeholder={isCnpj ? '00.000.000/0000-00' : '000.000.000-00'}
                            className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            {...field}
                            onChange={(e) => field.onChange(
                              isCnpj ? formatCNPJ(e.target.value) : formatCPF(e.target.value)
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AnimatePresence>
                  {isCnpj && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                  placeholder="Razão social"
                                  className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <Shield className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-xs text-slate-400">Seus dados estão seguros</span>
                </div>
              </form>
            </Form>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
