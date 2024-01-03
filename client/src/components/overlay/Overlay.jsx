import React, { useEffect, useLayoutEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { useOverlayContext } from "../../context/OverlayProvider";

import styles from "./overlay.module.scss";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";
import { X } from "@phosphor-icons/react";

const Overlay = () => {
  const { overlayOpened, overlayProps, closeOverlay } = useOverlayContext();

  const { contentElement } = overlayProps;

  const moutingPoint = useMemo(() => document.createElement("div"), []);

  useLayoutEffect(() => {
    if (overlayOpened) {
      document.body.appendChild(moutingPoint);
      return () => {
        document.body.removeChild(moutingPoint);
      };
    }
  }, [overlayOpened, moutingPoint]);

  const onCloseModal = (e) => {
    if (e.key === "Escape") {
      closeOverlay();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onCloseModal);
    return () => {
      document.removeEventListener("keydown", onCloseModal);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!overlayOpened) {
    return null;
  }

  return (
    <>
      {ReactDOM.createPortal(
        <>
          <div className={styles["overlay"]}>
            <CallToAction
              type="tiny"
              message=""
              icon={<X size={18} color="black" />}
              onClick={closeOverlay}
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

export default Overlay;
