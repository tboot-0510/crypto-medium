import React from "react";
import mediumLogo from "../../assets/medium_icon.svg";

import styles from "./metabar.module.scss";
import { useSelector } from "react-redux";
import CallToAction from "../../reusable-elements/CallToAction/CallToAction";
import { moreIcon, notificationIcon } from "../../assets/icons";
import AvatarMenu from "../avatar/AvatarMenu";

const MetaBar = ({ disabled, onClick }) => {
  const { user } = useSelector((state) => ({
    user: state.user.informations.id,
  }));
  return (
    <div className={styles.metabar}>
      <div className={styles["metabar-header"]}>
        <div className={styles["metabar-block"]}>
          <a>
            <img src={mediumLogo} className="logo react" alt="Medium logo" />
          </a>
          <div className="f ai-c jc-c ml-12 ">
            <span className={styles["metabar-span"]}>{`Draft in ${user}`}</span>
            <span className={`${styles["metabar-text"]} ml-16`}>Saved</span>
          </div>
        </div>
        <div className={styles["metabar-blockend"]}>
          <CallToAction
            disabled={disabled}
            onClick={onClick}
            type="primary"
            message="Publish"
            additionalStyle={{
              fontSize: "20px",
              backgroundColor: "#1a8917",
            }}
          />
          <div className="f">{moreIcon}</div>
          <div className="f">{notificationIcon}</div>
          <AvatarMenu />
        </div>
      </div>
    </div>
  );
};

export default MetaBar;
