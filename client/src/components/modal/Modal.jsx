import React, { useEffect, useLayoutEffect, useMemo } from "react";
import ReactDOM from "react-dom";

import { useModalContext } from "../../context/ModalProvider";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";

import styles from "./modal.module.scss";
import { X } from "@phosphor-icons/react";

const Modal = () => {
  const { modalOpened, closeModal, modalProps } = useModalContext();

  const { contentElement } = modalProps;

  const moutingPoint = useMemo(() => document.createElement("div"), []);

  useLayoutEffect(() => {
    if (modalOpened) {
      document.body.appendChild(moutingPoint);
      return () => {
        document.body.removeChild(moutingPoint);
      };
    }
  }, [modalOpened, moutingPoint]);

  // useEffect(() => {
  //     if (modalOpened) {
  //         deactivateScroll();
  //         return () => {
  //             activateScroll();
  //         };
  //     }
  // }, [modalOpened]);

  const onCloseModal = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onCloseModal);
    return () => {
      document.removeEventListener("keydown", onCloseModal);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!modalOpened) {
    return null;
  }

  return (
    <>
      {ReactDOM.createPortal(
        <>
          <div
            className={styles["modal-blur-container"]}
            onClick={closeModal}
          />
          <div id="MediumModal" className={styles["modal-container"]}>
            <CallToAction
              type="tiny"
              message=""
              icon={<X size={18} color="black" />}
              onClick={closeModal}
              additionalStyle={{
                right: 12,
                top: 12,
                position: "absolute",
                backgroundColor: "transparent",
              }}
            />

            {contentElement}
          </div>
        </>,
        moutingPoint
      )}
    </>
  );
};

export default Modal;
