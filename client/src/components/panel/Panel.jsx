import { useEffect } from "react";
import classNames from "classnames";

import { usePanelContext } from "../../context/PanelProvider";
import useClosingPanel from "../../lib/hooks/useClosingPanel.js";
import { X } from "@phosphor-icons/react/dist/ssr";

import styles from "./panel.module.scss";

const Panel = () => {
  const {
    panelOpened,
    panelProps,
    closingAnimatedPanel,
    isFullScreen,
    setIsFullScreen,
  } = usePanelContext();

  const { onClosingPanel } = useClosingPanel();

  useEffect(() => {
    if (panelOpened) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "scroll";
      };
    }
  }, [panelOpened]);

  useEffect(() => {
    window.onpopstate = () => {
      onClosingPanel(); // to handle back button
    };
  }, [onClosingPanel]);

  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === "Escape" || event.code === "backbutton") {
        onClosingPanel();
      }
    }
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [panelProps, onClosingPanel]);

  const panelContainerClass = classNames(styles["Panel-container"], {
    [styles["closing-panel"]]: closingAnimatedPanel,
    [styles["opening-panel"]]: !closingAnimatedPanel,
  });

  return (
    <>
      {panelOpened && (
        <>
          <div
            className={styles["Panel-blur-container"]}
            onClick={onClosingPanel}
          />
          <div
            className={panelContainerClass}
            style={
              isFullScreen
                ? {
                    width: "auto",
                    left: "16rem",
                    right: 0,
                  }
                : { width: panelProps.panelWidth }
            }
          >
            <div className="h-100-p" style={{ boxSizing: "border-box" }}>
              <div className={styles["Panel-content"]}>
                <div className={styles["Panel-content-element"]}>
                  {panelProps.contentElement}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Panel;
