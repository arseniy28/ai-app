import { useEffect, useState } from "react";
import styles from "./UserMenu.module.css";
import axios from "axios";

type Props = {
  onLogout: () => void;
};

const API_BASE = "http://localhost:8001";

export default function UserMenu({ onLogout }: Props) {
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    const storedAttempts = localStorage.getItem("attempts");
    if (storedAttempts) {
      setAttempts(Number(storedAttempts));
    }
  }, []);

  return (
    <div className={styles.menu}>
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
