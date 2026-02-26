import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Diálogo de confirmação de exclusão reutilizável.
 * @param {boolean} open - Controla visibilidade
 * @param {function} onOpenChange - Callback (open: boolean) => void
 * @param {string} title - Título do diálogo (ex: "Excluir item?")
 * @param {string} [description] - Descrição (pode usar itemName no texto)
 * @param {string} [itemName] - Nome do item a excluir (exibido na descrição se description não for passada)
 * @param {function} onConfirm - Callback ao confirmar (geralmente chama mutation)
 * @param {boolean} [isPending] - Desabilita botão durante a mutation
 */
export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  onConfirm,
  isPending = false,
}) {
  const desc = description ?? (itemName ? `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.` : "Esta ação não pode ser desfeita.");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
