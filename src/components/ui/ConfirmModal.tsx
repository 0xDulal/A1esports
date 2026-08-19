"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertTriangle, Trash2, Info, Loader2 } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  loading: externalLoading = false,
}: ConfirmModalProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading || internalLoading;

  const handleConfirmClick = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
    } catch (err) {
      console.error("Error executing confirmation action:", err);
    } finally {
      setInternalLoading(false);
      onClose();
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return (
          <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2 shrink-0">
            <Trash2 size={24} />
          </div>
        );
      case "warning":
        return (
          <div className="h-12 w-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mb-2 shrink-0">
            <AlertTriangle size={24} />
          </div>
        );
      case "info":
      default:
        return (
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2 shrink-0">
            <Info size={24} />
          </div>
        );
    }
  };

  const getConfirmBtnStyle = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 text-black font-black shadow-[0_0_20px_rgba(234,179,8,0.3)]";
      case "info":
      default:
        return "bg-primary hover:bg-primary/90 text-black font-black shadow-[0_0_20px_rgba(255,0,102,0.3)]";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="bg-neutral-950 border-white/10 text-white max-w-md p-6 space-y-4">
        <DialogHeader className="flex flex-col items-center text-center">
          {getIcon()}
          <DialogTitle className="text-xl font-bold uppercase tracking-tight text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-400 font-medium leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirmClick}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 ${getConfirmBtnStyle()}`}
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
