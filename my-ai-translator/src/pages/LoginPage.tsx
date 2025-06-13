import React from "react";
import styles from "./LoginPage.module.css";
import LoginForm from "../components/LoginForm";
import Binary from "../assets/Binary_001.png";
import Saly13 from "../assets/Saly-13.png";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <img src={Binary} alt="Фон Binary" className={styles.bgLeft} />
      <img src={Saly13} alt="Персонаж" className={styles.bgRight} />

      <div className={styles.header}>
        <span>Связаться с нами</span>
        <span>Помощь</span>
        <span>Поддержка клиентов</span>
      </div>

      <div className={styles.left}>
        <LoginForm />
      </div>
    </div>
  );
}
