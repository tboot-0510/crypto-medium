import React, { useContext, useMemo, useState, useCallback } from "react";

const INITIAL_STATE = {
  title: "",
  contentElement: null,
  onClose: () => {},
  openModal: () => {},
  closeModal: () => {},
  updateModal: () => {},
};

const MODAL_CONTEXT = React.createContext({
  modalOpened: false,
  modalProps: {
    title: "",
    contentElement: null,
    onClose: () => {},
  },
  openModal: () => {},
  closeModal: () => {},
  updateModal: () => {},
});

const useModalContext = () => useContext(MODAL_CONTEXT);

const ModalProvider = ({ children }) => {
  const [modalProps, setModalProps] = useState(INITIAL_STATE);

  const openModal = useCallback(({ title, contentElement, onClose }) => {
    setModalProps({ title, contentElement, onClose });
  }, []);

  const closeModal = useCallback(() => {
    if (modalProps.onClose) return modalProps.onClose();
    setModalProps(INITIAL_STATE);
  }, [modalProps]);

  const updateModal = useCallback(
    (newProps) => {
      setModalProps({ ...modalProps, ...newProps });
    },
    [modalProps]
  );

  const value = useMemo(
    () => ({
      modalOpened: modalProps.contentElement !== null,
      openModal,
      updateModal,
      closeModal,
      modalProps,
    }),
    [modalProps, updateModal, openModal, closeModal]
  );

  return (
    <MODAL_CONTEXT.Provider value={value}>{children}</MODAL_CONTEXT.Provider>
  );
};

export { useModalContext };
export default ModalProvider;
