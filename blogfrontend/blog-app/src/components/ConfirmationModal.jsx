import "../styles/ConfirmationModal.scss";

function ConfirmationModal({ isWorking, onConfirm, closeModal, modalText, delicate, children }) {
  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal__text">
        {modalText}
      </div>

      {children}

      {
        delicate && <p className="confirmation-modal__delicate">This action can not be undone 💀</p>
      }

      <div className="confirmation-modal__actions">
        <button
          className="confirmation-modal__cancel"
          disabled={isWorking}
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className={`confirmation-modal__confirm${delicate ? " confirmation-modal__confirm--danger" : ""}`}
          disabled={isWorking}
          onClick={() => {
            onConfirm();
            closeModal?.();
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default ConfirmationModal;