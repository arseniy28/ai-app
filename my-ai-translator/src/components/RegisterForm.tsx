// RegisterForm.tsx (с диагностикой Network Error)
import React, { useState } from "react";
import styles from "./RegisterForm.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8001/register", {
        email,
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("attempts", res.data.attempts_left);

      navigate("/chat");
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        alert("Превышено время ожидания запроса");
      } else if (err.message === 'Network Error') {
        alert("Network Error: проверьте, запущен ли сервер API на http://localhost:8001");
      } else {
        alert("Ошибка регистрации: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Регистрация</h2>
      <p className={styles.subtitle}>Рады что выбрали нас! 😊</p>

      <input
        className={styles.input}
        placeholder="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="email"
        placeholder="Почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Подтвердите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button type="submit" className={styles.button}>Зарегистрироваться</button>

      <div className={styles.divider}>или</div>

      <button type="button" className={styles.googleBtn}>
        <span className={styles.googleIcon}>G</span>
        Вход через Google
      </button>
    </form>
  );
}
