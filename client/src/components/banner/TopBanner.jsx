import React, { useRef } from "react";
import styles from "./topBanner.module.scss";
import { starIcon } from "../../assets/icons";
import { useNavigate } from "react-router-dom";
import { X } from "@phosphor-icons/react/dist/ssr";

const TopBanner = () => {
  const navigate = useNavigate();
  const bannerRef = useRef(null);

  const handleClose = () => {
    if (bannerRef.current) {
      bannerRef.current.style.display = "none";
    }
  };
  return (
    <div ref={bannerRef} className={styles.banner}>
      <div className={styles["banner-content"]}>
        <div className="f ai-c mr-8">{starIcon}</div>
        <p className="f fd-r">
          <span>
            Get unlimited access to the best of Medium for less than $1/week.
          </span>
          <div className="ml-8">
            <a
              style={{ textDecoration: "underline" }}
              href={() => navigate("/plans")}
            >
              <span style={{ fontWeight: 500 }}>Become a member</span>
            </a>
          </div>
        </p>
      </div>
      <div className={styles["banner-close"]} onClick={handleClose}>
        <X size={24} />
      </div>
    </div>
  );
};

export default TopBanner;
