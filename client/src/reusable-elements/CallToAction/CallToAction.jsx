/* eslint-disable react/prop-types */
import React, { useState } from "react";
import styles from "./callToAction.module.scss";

const CallToAction = (props) => {
  const {
    disabled,
    type,
    onClick,
    additionalStyle,
    icon,
    message,
    secondaryBackground,
    additionalPill,
    additionalClassNames,
    iconAtTheEnd,
    addSpace,
    buttonType = "button",
  } = props;
  const [hover, setHover] = useState(false);
  const isSecondary = type === "secondary";
  const customSecondaryBackground = hover
    ? `linear-gradient(${secondaryBackground}, ${secondaryBackground}) padding-box,linear-gradient(230deg, ${"var(--secondary)"} 0%, ${"var(--primary)"} 100%) border-box` // eslint-disable-line max-len
    : `linear-gradient(${secondaryBackground}, ${secondaryBackground}) padding-box,linear-gradient(50deg, ${"var(--secondary)"} 0%, ${"var(--primary)"} 100%) border-box`; // eslint-disable-line max-len

  const color = {
    primary: "white",
    secondary: "inherit",
    third: "var(--faintgrey)",
    tiny: "var(--faintgrey)",
  };

  const doNothing = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <button
      // disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`${styles[`${type}-button`]} ${
        disabled ? styles.disabled : ""
      } ${additionalClassNames ?? ""}`}
      onClick={disabled ? doNothing : onClick}
      style={{
        background:
          isSecondary && secondaryBackground ? customSecondaryBackground : "",
        color: color[type],
        ...(additionalStyle || {}),
      }}
      type={buttonType}
    >
      {iconAtTheEnd ? (
        <>
          <div className="fs-16">
            <h6 style={{ fontSize: "inherit" }}>{message}</h6>
          </div>
          {!!icon && (
            <div className={`f ai-c ${message && "ml-8"}`}>{icon}</div>
          )}
        </>
      ) : (
        <div className="f w-100-p ai-c jc-sb">
          {!!icon && (
            <div className={`f ai-c ${message && "mr-8"}`}>{icon}</div>
          )}
          <div className="fs-16">
            <h6 style={{ fontSize: "inherit" }}>{message}</h6>
          </div>
          {!!addSpace && <div style={{ width: 24, height: 24 }} />}
        </div>
      )}
      {!!additionalPill && (
        <div style={{ position: "relative" }}>
          <div className={styles["additional-pill-container"]}>
            {additionalPill}
          </div>
        </div>
      )}
    </button>
  );
};

export default CallToAction;
