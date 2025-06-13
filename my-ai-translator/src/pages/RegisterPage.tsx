import React from "react";
import styles from "./RegisterPage.module.css";
import RegisterForm from "../components/RegisterForm";
import Saly13 from "../assets/Saly-13.png";
import Binary from "../assets/Binary_001.png";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <img src={Binary} alt="фон левый" className={styles.bgLeft} />
      <img src={Saly13} alt="парень с ноутбуком" className={styles.bgRight} />

      <div className={styles.header}>
        <span>Связаться с нами</span>
        <span>Помощь</span>
        <span>Поддержка клиентов</span>
      </div>

      <RegisterForm />
    </div>
  );
}
