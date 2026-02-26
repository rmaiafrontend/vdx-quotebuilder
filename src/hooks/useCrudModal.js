import { useState, useCallback } from "react";

/**
 * Hook para gerenciar estado de modal CRUD (novo/editar): abertura, item em edição e formulário.
 * @param {object} initialFormState - Estado inicial do formulário
 * @returns {object} modalOpen, setModalOpen, editingItem, setEditingItem, formState, setFormState, openNew, openEdit, close
 */
export function useCrudModal(initialFormState) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formState, setFormState] = useState(initialFormState);

  const openNew = useCallback(
    (override = {}) => {
      setEditingItem(null);
      setFormState({ ...initialFormState, ...override });
      setModalOpen(true);
    },
    [initialFormState]
  );

  const openEdit = useCallback((item, mapItemToForm) => {
    if (!item) return;
    setEditingItem(item);
    setFormState(mapItemToForm ? mapItemToForm(item) : { ...item });
    setModalOpen(true);
  }, []);

  const close = useCallback(() => {
    setModalOpen(false);
    setEditingItem(null);
    setFormState(initialFormState);
  }, [initialFormState]);

  return {
    modalOpen,
    setModalOpen,
    editingItem,
    setEditingItem,
    formState,
    setFormState,
    openNew,
    openEdit,
    close,
  };
}
