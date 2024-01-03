import React, { useContext, useMemo, useState, useCallback } from "react";

const INITIAL_STATE = {
  contentElement: null,
  onClose: () => {},
  openOverlay: () => {},
  closeOverlay: () => {},
};

const OVERLAY_CONTEXT = React.createContext({
  overlayOpened: false,
  overlayProps: {
    contentElement: null,
    onClose: () => {},
  },
  openOverlay: () => {},
  closeOverlay: () => {},
});

const useOverlayContext = () => useContext(OVERLAY_CONTEXT);

const OverlayProvider = ({ children }) => {
  const [overlayProps, setOverlayProps] = useState(INITIAL_STATE);

  const openOverlay = useCallback(({ contentElement, onClose }) => {
    setOverlayProps({ contentElement, onClose });
  }, []);

  const closeOverlay = useCallback(() => {
    if (overlayProps.onClose) return overlayProps.onClose();
    setOverlayProps(INITIAL_STATE);
  }, [overlayProps]);

  const value = useMemo(
    () => ({
      overlayOpened: overlayProps.contentElement !== null,
      openOverlay,
      closeOverlay,
      overlayProps,
    }),
    [overlayProps, openOverlay, closeOverlay]
  );

  return (
    <OVERLAY_CONTEXT.Provider value={value}>
      {children}
    </OVERLAY_CONTEXT.Provider>
  );
};

export { useOverlayContext };
export default OverlayProvider;
