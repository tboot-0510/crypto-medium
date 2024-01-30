import styles from "./post.module.scss";
import { formatDateTime, generateIcon, toUppercase } from "../../utils/format";
import Badge from "../../reusable-elements/badge/Badge";
import { moreIcon, mutePost, savePost, starIcon } from "../../assets/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Post = ({ item, index }) => {
  const { currentUserId, currentUsername } = useSelector((state) => ({
    currentUsername: state.user.informations.name,
    currentUserId: state.user.informations.id,
  }));

  const navigate = useNavigate();
  const showMoreText = (text) => {
    if (text.length < 130) return text;

    return text.slice(0, 130) + "...";
  };

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
          <a className={styles.icon}>
            {/* <img src={""} width="24" height="24" alt={item.author} /> */}
            {!item.icon && (
              <div className="f jc-c ai-c">
                {toUppercase(generateIcon(item.userId?.name))}
              </div>
            )}
          </a>
        </div>
        <div className="f fw-w ai-c ml-8 w-100-p">
          <span className={styles.author}>{item.userId?.name}</span>
          <div className="f-1" style={{ flex: "0 0 auto" }}>
            <p className="f fd-r ai-c jc-c">
              <span className="f jc-c ai-c" style={{ margin: "0px 4px" }}>
                ·
              </span>
              <span className={styles.date}>
                {formatDateTime(item.createdAt)}
              </span>
            </p>
            {item.membersOnly && (
              <div className="f fd-r jc-c ml-8" style={{ fontSize: "14px" }}>
                <div className="f ai-c mr-8">{starIcon}</div>
                <p className="f fd-r ai-c">
                  <span>Members only</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="f mt-12">
        <div className="f f-2 fd-c" style={{ wordBreak: "break-word" }}>
          <a
            className={styles["article-link"]}
            rel="noopener follow"
            onClick={() => navigate(`/post/${item._id}`)}
          >
            <h2 className={styles["article-title"]}>{item.title}</h2>
            <p className={styles["article-description"]}>
              {showMoreText(item.markdown)}
            </p>
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
            {item.image ? (
              <img
                src={item.image}
                width="112"
                height="112"
                alt={item.userId.name}
              />
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
