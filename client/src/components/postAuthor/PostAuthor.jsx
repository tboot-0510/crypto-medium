import { formatDateTime, generateIcon, toUppercase } from "../../utils/format";
import Jazzicon from "react-jazzicon";
import styles from "./postAuthor.module.scss";

const getBackground = (account, icon) => {
  if (icon)
    return {
      backgroundImage: `url(${icon})`,
      backgroundColor: "transparent",
    };
  if (account)
    return {
      backgroundColor: "transparent",
    };
  return {
    backgroundColor: "green",
  };
};

const PostAuthor = ({ author, createdAt }) => {
  const linkElement = "";

  if (!author) return;

  const { username, walletAccount, icon } = author;

  const externalWalletAccount = walletAccount?.externalAccountId;
  const hasIconOrExternalWallet = externalWalletAccount || icon;

  return (
    <div className="f fd-c">
      <div className="f fd-r">
        <div
          className={styles.icon}
          style={getBackground(externalWalletAccount, icon)}
        >
          {externalWalletAccount && (
            <Jazzicon
              diameter={44}
              seed={parseInt(externalWalletAccount.slice(2, 10), 16)}
            />
          )}
          <a className={styles["icon-title"]} href={linkElement}>
            {/* <img src={""} width="24" height="24" alt={item.author} /> */}
            {!hasIconOrExternalWallet && (
              <div className="f jc-c ai-c">
                {toUppercase(generateIcon(username))}
              </div>
            )}
          </a>
        </div>
        <div className="f fd-c ml-12 w-100-p">
          {/* <div style={{ flex: "1 1 0%" }}> */}
          <div>
            <span className={styles["span-title"]}>
              <div>{username}</div>
              <hr className={styles.separator} />
            </span>
          </div>
          <div>
            <span className={styles["span-subtitle"]}>
              <div>3 min read</div>
              <span className="f jc-c ai-c" style={{ margin: "0px 4px" }}>
                ·
              </span>
              {formatDateTime(createdAt, true)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAuthor;
