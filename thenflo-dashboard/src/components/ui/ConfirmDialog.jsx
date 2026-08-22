import React from "react";
import Modal from "./Modal.jsx";
import Button from "./Button.jsx";

export default function ConfirmDialog({ open, title = "Are you sure?", body, confirmLabel = "Confirm", danger = true, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} width={360} footer={
      <>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </>
    }>
      <div className="text-[13.5px] text-ink2">{body}</div>
    </Modal>
  );
}
