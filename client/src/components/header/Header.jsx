import React from "react";
import mediumLogo from "../../assets/medium.svg";
import styles from "./header.module.scss";
import { Link } from "react-router-dom";
import { useModalContext } from "../../context/ModalProvider";
import AuthenticationModal from "../layout/modal/AuthenticationModal";

const nav = [
  {
    title: "Write",
    style: {},
  },
  {
    title: "Sign in",
    style: {},
  },
  {
    title: "Get started",
    style: {
      borderRadius: "99em",
      borderColor: "#000000",
      backgroundColor: "#000000",
      padding: "8px 16px",
      color: "#FFFFFF",
      //fontFamily: "sohne,Helvetica Neue, Helvetica, Arial, sans-serif",
    },
  },
];

const Header = () => {
  const { openModal } = useModalContext();

  const openAuthModal = () => {
    openModal({
      contentElement: <AuthenticationModal />,
    });
  };

  return (
    <div className={styles.header}>
      <div className={styles["header-container"]}>
        <div className={styles["header-items"]}>
          <a href="https://localhost:8000" target="_blank" rel="noreferrer">
            <img src={mediumLogo} className="logo react" alt="Medium logo" />
          </a>
          <div className="f-1" />
          <div className="f fd-r ai-c g-24">
            {nav.map((navItem, key) => (
              <Link key={key} onClick={openAuthModal} style={navItem.style}>
                {navItem.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
