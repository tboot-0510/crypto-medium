import { X } from "@phosphor-icons/react/dist/ssr";
import { usePanelContext } from "../../../context/PanelProvider";
import { useSelector } from "react-redux";
import Jazzicon from "react-jazzicon";

import styles from "./commentPanel.module.scss";
import { generateIcon, toUppercase } from "../../../utils/format";
import CallToAction from "../../../reusable-elements/CallToAction/CallToAction";

const getBackground = (account, icon) => {
  if (icon)
    return {
      backgroundImage: `url(${icon})`,
      backgroundColor: "transparent",
    };
  if (account)
    return {
      backgroundColor: "transparent",
    };
  return {
    backgroundColor: "green",
  };
};

const CommentPanel = () => {
  const { closePanel } = usePanelContext();

  const { currentUsername, externalWalletAccount } = useSelector((state) => ({
    currentUsername: state.user.informations.name,
    externalWalletAccount: state.user.informations.externalWalletAccount,
  }));

  const icon = "";

  const hasIconOrExternalWallet = externalWalletAccount || icon;

  return (
    <div>
      <div className="f fd-r jc-sb p-24">
        <div className="f fd-r">
          <h2>Responses (267)</h2>
        </div>
        <div className="f fd-r jc-c ai-c" onClick={() => closePanel()}>
          <X size={24} />
        </div>
      </div>
      <div className="mb-24" style={{ padding: "0px 24px" }}>
        <div className={styles["comment-section"]}>
          <div className={styles["comment-author"]}>
            <div className="f ai-c">
              <div
                className={styles.icon}
                style={getBackground(externalWalletAccount, icon)}
              >
                {externalWalletAccount && (
                  <Jazzicon
                    diameter={32}
                    seed={parseInt(externalWalletAccount.slice(2, 10), 16)}
                  />
                )}
                <a className={styles["icon-title"]} href={""}>
                  {/* <img src={""} width="24" height="24" alt={item.author} /> */}
                  {!hasIconOrExternalWallet && (
                    <div className="f jc-c ai-c">
                      {toUppercase(generateIcon(currentUsername))}
                    </div>
                  )}
                </a>
              </div>
              <div className="f ml-12">{currentUsername}</div>
            </div>
          </div>
          <div className={styles["comment-input"]}>
            <div className="p-12">
              <div
                className={styles["comment-textbox"]}
                role="textbox"
                aria-multiline="true"
                data-slate-editor="true"
                data-slate-node="value"
                contentEditable="true"
              >
                <div data-slate-node="element">
                  <p>
                    <span data-slate-node="text">
                      <span data-slate-leaf="true">
                        <span
                          //   className={styles["comment-textbox-placeholder"]}
                          data-slate-placeholder="true"
                          contentEditable="false"
                        >
                          What are your thoughts?
                        </span>
                        <span data-slate-zero-width="n" data-slate-length="0">
                          <br />
                        </span>
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="f fd-r jc-fe g-8 mt-32 p-12">
            <CallToAction
              onClick={closePanel}
              type="primary"
              message="Cancel"
              additionalStyle={{
                backgroundColor: "",
                color: "black",
                height: "31px",
                padding: "0 16px",
                borderRadius: "99em",
                width: "fit-content",
                fontSize: "11px",
              }}
            />
            <CallToAction
              //   onClick={unlockPost}
              type="primary"
              message="Respond"
              additionalStyle={{
                backgroundColor: "#1a8917",
                height: "31px",
                padding: "0 16px",
                border: "1px solid rgba(0,0,0,.15)",
                borderRadius: "99em",
                width: "fit-content",
                fontSize: "11px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentPanel;
