import React from "react";
import "./DeleteModal.css";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this task?</p>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="confirm-delete-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}