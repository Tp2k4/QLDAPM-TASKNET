import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Confirm",
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="p-6">
          <h2 id="modal-title" className="text-lg font-semibold mb-3">
            {title}
          </h2>

          <div className="mb-4">{children}</div>

          <div className="flex justify-end gap-2">
            <button className="btn ghost small" onClick={onClose}>
              Hủy
            </button>
            {onConfirm && (
              <button className="btn small" onClick={onConfirm}>
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;