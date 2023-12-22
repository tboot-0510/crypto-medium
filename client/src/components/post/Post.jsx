import React from "react";
import styles from "./post.module.scss";
import { formatDateTime, toUppercase } from "../../utils/format";
import Badge from "../../reusable-elements/badge/Badge";
import { moreIcon, mutePost, savePost } from "../../assets/icons";

const Post = ({ item, index }) => {
  const generateIcon = (name) => {
    if (!name) return "";

    let displayName = name.slice(0, 1);
    if (name.length > 2) displayName = name.slice(0, 2);

    return <div className="f jc-c ai-c">{toUppercase(displayName)}</div>;
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(item.description, "text/html");

  const imageLink = doc
    .querySelector(".medium-feed-image img")
    ?.getAttribute("src");
  const snippetElement = doc.querySelector(".medium-feed-snippet")?.innerText;
  const linkElement = doc.querySelector(".medium-feed-link a")?.href;

  return (
    <div className={`${styles.article} ${index !== 0 ? "pt-24" : ""}`}>
      <div className="f ai-c">
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
            {!item.icon && generateIcon(item.author)}
          </a>
        </div>
        <div className="f fw-w ai-c ml-8 w-100-p">
          <span className={styles.author}>{item.author}</span>
          <div className="f-1" style={{ flex: "0 0 auto" }}>
            <p className="f fd-r ai-c jc-c">
              <span className="f jc-c ai-c" style={{ margin: "0px 4px" }}>
                ·
              </span>
              <span className={styles.date}>
                {formatDateTime(item.pubDate)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="f mt-12">
        <div className="f f-2 fd-c" style={{ wordBreak: "break-word" }}>
          <a
            className={styles["article-link"]}
            rel="noopener follow"
            href={item.link}
          >
            <h2 className={styles["article-title"]}>{item.title}</h2>
            <p className={styles["article-description"]}>{snippetElement}</p>
          </a>
          <div className={styles["article-footer"]}>
            <div className="f f-3 ai-c">
              <Badge item="Blockchain" />
            </div>
            <div className="f fd-r ai-c g-12">
              <span style={{ cursor: "pointer" }}>{savePost}</span>
              <span style={{ cursor: "pointer" }}>{mutePost}</span>
              <span style={{ cursor: "pointer" }}>{moreIcon}</span>
            </div>
          </div>
        </div>
        <div className="ml-48 bs-bb">
          <a
            className={styles["article-link"]}
            rel="noopener follow"
            href={item.link}
          >
            {/* <img src={imageLink} width="112" height="112" alt={item.author} />
             */}
            {imageLink ? (
              <img src={imageLink} width="112" height="112" alt={item.author} />
            ) : (
              <div style={{ width: "112px", height: "112px" }}>No Image</div>
            )}
          </a>
        </div>
      </div>
      <hr className={styles.separator} />
    </div>
  );
};

export default Post;
