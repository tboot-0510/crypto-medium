import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./avatarMenu.module.scss";
import GoogleIcon from "../../assets/google_icon.svg";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  libraryIcon,
  profileIcon,
  starIcon,
  storiesIcon,
} from "../../assets/icons";

const AvatarMenu = () => {
  const { user } = useSelector((state) => ({
    user: state.user.informations.user,
  }));
  const { navigate } = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdownElement = document.querySelector(".dropdown-container");
      if (dropdownElement && !dropdownElement.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const dropdownOptions = [
    {
      icon: profileIcon,
      title: "Profil",
      onClick: () => navigate(`/user/${user.id}`),
    },
    {
      icon: libraryIcon,
      title: "Library",
      onClick: () => navigate(`/user/${user.id}`),
    },
    {
      icon: storiesIcon,
      title: "Stories",
      onClick: () => navigate(`/user/${user.id}`),
    },
  ];

  const dropdownContent = (
    <div className={styles["dropdown-content"]}>
      <ul>
        {dropdownOptions.map((option, index) => {
          return (
            <li
              className={styles["dropdown-item"]}
              key={index}
              onClick={option.onClick}
            >
              {option?.icon}
              <div className="ml-12">{option.title}</div>
            </li>
          );
        })}
      </ul>
      <div
        style={{
          borderBottom: "1px solid rgb(242, 242, 242)",
          width: "100%",
          margin: "12px 0",
        }}
      />
      <div
        className={styles["dropdown-item"]}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px 25px",
        }}
      >
        Become a Medium Member
        <span className="f ai-c">{starIcon}</span>
      </div>
      <div
        style={{
          borderBottom: "1px solid rgb(242, 242, 242)",
          width: "100%",
          margin: "12px 0",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "0px 25px",
        }}
      >
        <p
          style={{
            color: "#6b6a6a",
            fontSize: "14px",
            marginBottom: "4px",
            marginTop: "2px",
          }}
        >
          Sign out
        </p>
        <span
          style={{ color: "gray", fontSize: "13.75px", marginBottom: "-3px" }}
        >
          Hello
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.avatar}>
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <img
          style={{
            width: "32px",
            borderRadius: "50%",
            border: "1px solid #d9d9d9",
            cursor: "pointer",
          }}
          src={GoogleIcon}
          alt=""
        />
      </button>
      {isDropdownOpen &&
        createPortal(
          <div
            className={styles["dropdown-portal"]}
            style={{
              transform: `translate(${window.innerWidth - 280}px, 52px)`,
            }}
          >
            {dropdownContent}
          </div>,
          document.body
        )}
    </div>
  );
};

export default AvatarMenu;