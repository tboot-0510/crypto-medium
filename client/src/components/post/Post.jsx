import React from "react";
import styles from "./post.module.scss";

const Post = ({ children }) => {
  return <div className={styles.article}>{children}</div>;
};

export default Post;
