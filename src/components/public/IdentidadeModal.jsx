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
  const { showModal, urlDefaults, identify, isLoading, error } = useVidraceiro();
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

  async function onSubmit(data) {
    try {
      await identify(data);
    } catch { /* error is handled by context */ }
  }

  if (!showModal) return null;

  return (
    <DialogPrimitive.Root open={showModal}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-[420px] translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-300"
        >
          <div className="rounded-3xl bg-white shadow-2xl ring-1 ring-black/[0.06] overflow-hidden">
            {/* Header */}
            <div className="relative px-6 pt-8 pb-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a3a8f] via-[#2962cc] to-[#e8751a]" />
              <div className="flex items-center mb-4">
                {company?.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <span className="font-bold text-lg text-slate-900">{company?.name || 'Vidraçaria'}</span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Confirme sua identidade
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Preencha seus dados para acessar seus orçamentos.
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}
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
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-[#1a3a8f] to-[#2962cc]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
