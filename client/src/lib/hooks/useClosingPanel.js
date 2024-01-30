import { isFunction } from "lodash";
import { usePanelContext } from "../../context/PanelProvider";

const useClosingPanel = () => {
  const { closePanel, setClosingAnimatedPanel, setIsFullScreen } =
    usePanelContext();

  function onClosingPanel(callback) {
    setClosingAnimatedPanel(true);
    setIsFullScreen(false);
    setTimeout(() => {
      closePanel();
      setClosingAnimatedPanel(false);
    }, 400);
    if (isFunction(callback)) {
      setTimeout(() => {
        callback();
      }, 450);
    }
  }

  return { onClosingPanel };
};

export default useClosingPanel;
