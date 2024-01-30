import React, { useContext, useMemo, useState, useCallback } from "react";

const INITIAL_STATE = {
  headerContentElement: {
    rating: null,
    name: null,
    image: null,
  },
  contentElement: null,
  onClose: () => null,
  panelWidth: "",
};

const PANEL_CONTEXT = React.createContext({
  panelOpened: false,
  openPanel: () => {},
  updatePanel: () => {},
  closePanel: () => {},
  panelProps: {
    headerContentElement: {
      rating: null,
      name: null,
      image: null,
    },
    contentElement: null,
    onClose: () => null,
    panelWidth: "",
  },
  closingAnimatedPanel: false,
  isFullScreen: false,
  setIsFullScreen: () => null,
});

const usePanelContext = () => useContext(PANEL_CONTEXT);

const PanelProvider = ({ children }) => {
  const [panelProps, setPanelProps] = useState(INITIAL_STATE);
  const [closingAnimatedPanel, setClosingAnimatedPanel] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const openPanel = useCallback(
    ({
      headerContentElement,
      contentElement,
      onClose,
      panelWidth,
      panelFullScreen,
    }) => {
      setPanelProps({
        headerContentElement,
        contentElement,
        onClose,
        panelWidth,
      });
      setIsFullScreen(!!panelFullScreen);
    },
    [setPanelProps]
  );

  const updatePanel = useCallback(
    (newProps) => {
      setPanelProps({ ...panelProps, ...newProps });
    },
    [panelProps, setPanelProps]
  );

  const closePanel = useCallback(() => {
    if (panelProps.onClose) panelProps.onClose();
    setPanelProps(INITIAL_STATE);
  }, [panelProps, setPanelProps]);

  const isPanelOpened = useMemo(
    () => panelProps.contentElement !== null,
    [panelProps.contentElement]
  );

  const value = useMemo(
    () => ({
      panelOpened: panelProps.contentElement != null,
      openPanel,
      updatePanel,
      closePanel,
      panelProps,
      closingAnimatedPanel,
      setClosingAnimatedPanel,
      isFullScreen,
      setIsFullScreen,
      isPanelOpened,
    }),
    [
      isPanelOpened,
      panelProps,
      openPanel,
      updatePanel,
      closePanel,
      closingAnimatedPanel,
      setClosingAnimatedPanel,
      isFullScreen,
      setIsFullScreen,
    ]
  );
  return (
    <PANEL_CONTEXT.Provider value={value}>{children}</PANEL_CONTEXT.Provider>
  );
};

export { usePanelContext };
export default PanelProvider;
