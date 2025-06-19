// LoginForm.tsx (обновлённый)
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./LoginForm.module.css";
import axios from "axios";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8001/login", {
        username,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("attempts", res.data.attempts_left);

      navigate("/chat");
    } catch (err: any) {
      alert("Ошибка входа: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Логин</h2>
      <p className={styles.subtitle}>Рады что выбрали нас! 😊</p>

      <input
        className={styles.input}
        placeholder="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        className={styles.input}
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

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
        У вас нет аккаунта? <Link to="/register" className={styles.link}>Регистрация</Link>
      </p>
    </form>
  );
}
