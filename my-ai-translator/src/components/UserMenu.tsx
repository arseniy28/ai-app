import styles from "./UserMenu.module.css";

type Props = {
  onLogout: () => void;
  requestCount: number;
};

export default function UserMenu({ onLogout, requestCount }: Props) {
  return (
    
    <div className={styles.menu}>
      <div className={styles.counter}>
        Кол-во запросов на перевод: <strong>{requestCount}</strong>
      </div>
      <button className={styles.logoutBtn} onClick={onLogout}>
        Выйти
      </button>
    </div>
  );
}
