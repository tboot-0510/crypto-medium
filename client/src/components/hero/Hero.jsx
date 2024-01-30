import React from "react";
import styles from "./hero.module.scss";
import mediumLogo from "../../assets/dynamic_medium.svg";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";
import { useModalContext } from "../../context/ModalProvider";
import AuthenticationModal from "../layout/modal/AuthenticationModal";

const Hero = () => {
  const { openModal } = useModalContext();

  const openAuthModal = () => {
    openModal({
      contentElement: <AuthenticationModal />,
    });
  };

  return (
    <div className={styles.hero}>
      <div className={styles["hero-svg"]}>
        <img src={mediumLogo} className="logo react" alt="Medium logo" />
      </div>
      <div className="f jc-c w-100-p">
        <div className={styles["hero-container"]}>
          <div className="f fd-r w-100-p">
            <div className={styles.text}>
              <div className="mb-24">
                <h2 className={styles.title}>Stay curious.</h2>
              </div>
              <div className="w-80-p mb-48">
                <h3 className={styles.subtitle}>
                  Discover stories, thinking, and expertise from writers on any
                  topic.
                </h3>
              </div>
              <CallToAction
                type="primary"
                message="Start reading"
                onClick={openAuthModal}
                centerText
                additionalStyle={{
                  width: "213px",
                  fontSize: "20px",
                  backgroundColor: "black",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
