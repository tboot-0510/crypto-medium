import React from "react";
import styles from "./suggestionBar.module.scss";
import { plusIcon } from "../../assets/icons";

const SuggestionBar = () => {
  return (
    <div className={styles["suggestion-bar"]}>
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
