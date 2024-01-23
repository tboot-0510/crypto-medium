import React, { useState } from "react";
import styles from "./authenticationModal.module.scss";
import MetamaskIcon from "../../assets/metamask_icon.svg";
import { Coins } from "@phosphor-icons/react";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";
import { startCryptoPayment } from "../../utils/connectors/metamask";
import { useSelector } from "react-redux";
import { useModalContext } from "../../context/ModalProvider";

const UnlockPostModal = () => {
  const [step, updateStep] = useState(0);
  const { account } = useSelector((state) => ({
    account: state.user.informations.externalWalletAccount,
  }));

  const { closeModal } = useModalContext();

  const stepComponents = {
    0: {
      title: "Unlock using your tokens",
      balance: {
        text: "Using your Medium balance",
        onClick: () => updateStep({ id: 1, provenance: 0 }),
      },
      crypto: {
        text: "Using your crypto balance",
        onClick: () => startCryptoPayment(0.01, account, closeModal),
      },
    },
  };

  return (
    <div className="f fd-r w-100-p h-100-p jc-c" style={{ minHeight: "495px" }}>
      <div
        className="fd-c ai-c jc-c"
        style={{
          width: "678px",
          textAlign: "center",
          padding: "44px 56px",
        }}
      >
        <h2 className={styles.title}>{stepComponents[step]?.title}</h2>
        <div className="f fd-r jc-c ai-c g-12 mt-32">
          <CallToAction
            type="primary"
            message={stepComponents[step].balance.text}
            icon={<Coins color="black" weight="regular" size={24} />}
            onClick={stepComponents[step].balance.onClick}
            additionalStyle={{
              width: "200px",
              height: "150px",
              borderRadius: "12px",
              borderWidth: 1,
              borderColor: "black",
              backgroundColor: "white",
              color: "black",
            }}
          />
          <CallToAction
            type="primary"
            message={stepComponents[step].crypto.text}
            icon={<img src={MetamaskIcon} width="24" height="24" />}
            onClick={stepComponents[step].crypto.onClick}
            additionalStyle={{
              width: "200px",
              height: "150px",
              borderRadius: "12px",
              borderWidth: 1,
              borderColor: "black",
              backgroundColor: "white",
              color: "black",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UnlockPostModal;
