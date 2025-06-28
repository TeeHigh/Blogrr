import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "../styles/Modal.scss";
import Overlay from "./Overlay";
import { HiXMark } from "react-icons/hi2";

const ModalContext = createContext();

const Modal = ({ children }) => {
  const [openWindowName, setOpenWindowName] = useState("");

  const openModal = (windowName) => {
    setOpenWindowName(windowName);
  };

  const closeModal = () => {
    setOpenWindowName("");
  };

  return (
    <ModalContext.Provider
      value={{
        openWindowName,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

function Open({ children, opens }) {
  const { openModal } = useContext(ModalContext);

  return cloneElement(children, {
    onClick: () => openModal(opens),
  });
}

function Window({ children, name }) {
  const modalRoot = document.getElementById("root");
  const ref = useRef();

  const { openWindowName, closeModal } = useContext(ModalContext);

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          closeModal();
        }
      }
      document.addEventListener("click", handleClick, true);
      return () => document.removeEventListener("click", handleClick);
    },
    [closeModal]
  );

  if (openWindowName !== name || !modalRoot) return null;

  return createPortal(
    <Overlay>
      <div className="modal-window">
        <div className="modal-window__content" ref={ref}>
          <div className="children-parent-container">

              <button onClick={closeModal} className="modal__close">
                <HiXMark />
              </button>
            {cloneElement(children, { closeModal: closeModal })}
          </div>
        </div>
      </div>
    </Overlay>,
    modalRoot
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
