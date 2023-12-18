import React from "react";
import styles from "./navBar.module.scss";
import mediumLogo from "../../assets/medium_icon.svg";
import Search from "../search/Search";
import { notificationIcon, writeBlogIcon } from "../../assets/icons";
import AvatarMenu from "../avatar/AvatarMenu";

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <div className="f-1 ai-c">
        <a>
          <img src={mediumLogo} className="logo react" alt="Medium logo" />
        </a>
        <Search />
      </div>
      <div className="f ai-c jc-c">
        <div className="f mr-32">
          <a
            className="fd-r jc-c ai-c"
            style={{ cursor: "pointer", color: "#6B6B6B", fontWeight: "400" }}
          >
            {writeBlogIcon}
            <div className="fs-14 ml-8">Write</div>
          </a>
        </div>
        <div className="f mr-32">{notificationIcon}</div>
        <AvatarMenu />
      </div>
    </div>
  );
};

export default NavBar;
