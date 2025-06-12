import React from "react";
import styles from "./LoginPage.module.css";
import LoginForm from "../components/LoginForm";
import Saly13 from "../assets/Saly-13.png"; // импорт картинки

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <LoginForm />
      </div>
      <div className={styles.right}>
        <div className={styles.textBlock}>
          <h1>
            Добро пожаловать в <strong>AI переводчик</strong>.<br />
            Это проект, где вы можете общаться с AI-переводчиком<br />
            через искусственный интеллект.
          </h1>
          <p>
            Зарегистрируйтесь или войдите в систему, чтобы начать общение.
          </p>
        </div>
        <div className={styles.imageWrapper}>
          <img src={Saly13} alt="Парень с ноутбуком" />
        </div>
      </div>
    </div>
  );
}
