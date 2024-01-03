import React from "react";
import styles from "./postAuthor.module.scss";
import { formatDateTime, generateIcon, toUppercase } from "../../utils/format";
import {
  clapIcon,
  commentIcon,
  listenIcon,
  moreIcon,
  mutePost,
  savePost,
  shareIcon,
} from "../../assets/icons";

const PostAuthor = () => {
  const item = { icon: "", author: "Thomas Boot", pubDate: "" };
  const linkElement = "";

  return (
    <div className="f fd-c">
      <div className="f fd-r">
        <div
          className={styles.icon}
          style={
            item.icon
              ? {
                  backgroundImage: `url(${item.icon})`,
                  backgroundColor: "transparent",
                }
              : {
                  backgroundColor: "green",
                }
          }
        >
          <a className={styles.icon} href={linkElement}>
            {/* <img src={""} width="24" height="24" alt={item.author} /> */}
            {!item.icon && (
              <div className="f jc-c ai-c">
                {toUppercase(generateIcon(item.author))}
              </div>
            )}
          </a>
        </div>
        <div className="f fd-c ml-12 w-100-p">
          <div style={{ flex: "1 1 0%" }}>
            <span className={styles["span-title"]}>
              <div>{item.author}</div>
              <hr className={styles.separator} />
            </span>
          </div>
          <div>
            <span className={styles["span-subtitle"]}>
              <div>3 min</div>
              {/* {formatDateTime(item.pubDate)} */}
            </span>
          </div>
        </div>
      </div>
      <div className={styles["post-actions"]}>
        <div className="f ai-c">
          <div style={{ width: "74px" }}>
            <div className="f fd-r ai-c">
              {clapIcon}
              {commentIcon}
            </div>
          </div>
        </div>

        <div className="f fd-r ai-c g-12">
          <span style={{ cursor: "pointer" }}>{savePost}</span>
          <span style={{ cursor: "pointer" }}>{listenIcon}</span>
          <span style={{ cursor: "pointer" }}>{shareIcon}</span>
          <span style={{ cursor: "pointer" }}>{moreIcon}</span>
        </div>
      </div>
    </div>
  );
};

export default PostAuthor;
