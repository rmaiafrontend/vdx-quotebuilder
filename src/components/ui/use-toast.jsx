import { useState, useEffect, useCallback } from "react";

const AUTO_DISMISS_MS = 4000;
const LISTENERS = new Set();
let toasts = [];
let idCounter = 0;

function emit() {
  const snapshot = [...toasts];
  LISTENERS.forEach((fn) => fn(snapshot));
}

function dismiss(id) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 300);
}

function toast({ title, description, variant = "default", duration = AUTO_DISMISS_MS }) {
  const id = String(++idCounter);
  const entry = { id, title, description, variant, open: true };
  toasts = [entry, ...toasts].slice(0, 5);
  emit();

  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }

  return { id, dismiss: () => dismiss(id) };
}

function useToast() {
  const [state, setState] = useState(toasts);

  useEffect(() => {
    LISTENERS.add(setState);
    return () => LISTENERS.delete(setState);
  }, []);

  return {
    toasts: state,
    toast,
    dismiss,
  };
}

export { useToast, toast };
