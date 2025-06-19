import { useEffect, useState } from "react";
import styles from "./UserMenu.module.css";

type Props = {
  onLogout: () => void;
};

export default function UserMenu({ onLogout }: Props) {
  const [username, setUsername] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedAttempts = localStorage.getItem("attempts");

    if (storedUsername) setUsername(storedUsername);
    if (storedAttempts) setAttempts(Number(storedAttempts));
  }, []);

  return (
    <div className={styles.menu}>
      <div className={styles.username}>
        👤 Вы вошли как: <strong>{username || "неизвестно"}</strong>
      </div>
      <div className={styles.counter}>
        Кол-во запросов на перевод: <strong>{attempts}</strong>
      </div>
      <button
        className={styles.logoutBtn}
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("attempts");
          onLogout();
        }}
      >
        Выйти
      </button>
    </div>
  );
}
