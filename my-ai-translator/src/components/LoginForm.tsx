import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";
import { Link } from "react-router-dom"

export default function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    navigate("/chat");  
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Логин</h2>
      <p className={styles.subtitle}>Рады что выбрали нас! 😊</p>

      <input className={styles.input} placeholder="Логин" required />
      <input type="password" className={styles.input} placeholder="Пароль" required />

      <div className={styles.checkboxRow}>
        <input type="checkbox" id="remember" />
        <label htmlFor="remember">Запомнить меня</label>
      </div>

      <button type="submit" className={styles.loginBtn}>Войти</button>

      <p className={styles.forgot}>Забыли пароль?</p>

      <div className={styles.divider}></div>

      <button type="button" className={styles.googleBtn}>
        <span className={styles.googleIcon}>G</span>
        Вход через Google
      </button>

      <p className={styles.register}>
  У вас нет аккаунта?{" "}
  <Link to="/register" className={styles.link}>
    Регистрация
  </Link>
</p>
    </form>
  );
}
