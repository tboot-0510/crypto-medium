import styles from "./badge.module.scss";

const Badge = ({ item, additionalStyle, icon, onClick }) => {
  return (
    <div
      className={styles.badge}
      style={{ ...additionalStyle }}
      onClick={onClick}
    >
      <div className="f jc-c ai-c">
        {item}
        {icon}
      </div>
    </div>
  );
};

export default Badge;
