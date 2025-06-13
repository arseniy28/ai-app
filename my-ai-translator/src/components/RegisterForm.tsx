import React from "react";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Зарегистрирован!");
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Регистрация</h2>
      <p className={styles.subtitle}>Рады что выбрали нас! 😊</p>

      <input className={styles.input} placeholder="Логин" required />
      <input className={styles.input} type="email" placeholder="Почта" required />
      <input className={styles.input} type="password" placeholder="Пароль" required />
      <input className={styles.input} type="password" placeholder="Подтвердите пароль" required />

      <button type="submit" className={styles.button}>Войти</button>

      <div className={styles.divider}>или</div>

      <button type="button" className={styles.googleBtn}>
        <span className={styles.googleIcon}>G</span>
        Вход через Google
      </button>
    </form>
  );
}
