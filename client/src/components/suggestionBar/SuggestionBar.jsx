import React, { useEffect, useState } from "react";
import styles from "./suggestionBar.module.scss";
import { plusIcon } from "../../assets/icons";

const INITIAL_TOP = 57;
const SuggestionBar = () => {
  const [top, setTop] = useState(INITIAL_TOP);

  useEffect(() => {
    const handleScroll = () => {
      if (INITIAL_TOP - window.scrollY < 0) {
        setTop(0);
        return;
      }
      setTop(INITIAL_TOP - window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles["suggestion-bar"]} style={{ top: `${top}px` }}>
      <div className={styles["suggestion-bar-content"]}>
        <div className={styles["suggestion-bar-menu"]}>
          <div className={styles["suggestion-bar-menu-items"]}>
            <button
              className={styles["suggestion-bar-menu-item"]}
              style={{
                color: "gray",
                height: "100%",
              }}
            >
              {plusIcon}
            </button>
            <div className={styles["suggestion-bar-menu-item"]}>For you</div>
            <div className={styles["suggestion-bar-menu-item"]}>Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionBar;
