import React from "react";
import styles from "./badge.module.scss";

const Badge = ({ item }) => {
  console.log("item", item);
  return <div className={styles.badge}>{item}</div>;
};

export default Badge;
