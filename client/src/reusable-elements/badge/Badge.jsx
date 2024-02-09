import styles from "./badge.module.scss";
import classNames from "classnames";
import { checkIcon } from "../../assets/icons";

const Badge = ({ item, additionalStyle, icon, checked, onClick }) => {
  const badgeClassName = classNames(styles.badge, {
    [styles["badge-checked"]]: checked,
  });

  const getIcon = (checked) => {
    if (checked) return checkIcon;
    return icon;
  };

  return (
    <div
      className={badgeClassName}
      style={{ ...additionalStyle }}
      onClick={onClick}
    >
      <div className="f jc-c ai-c">
        {item}
        {!!icon && <>{getIcon(checked)}</>}
      </div>
    </div>
  );
};

export default Badge;
