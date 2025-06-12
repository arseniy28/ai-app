import React, { useState } from "react";
import styles from "./ChatInterface.module.css";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, message]);
    setMessage("");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.logo}>AI Translator</h2>
        <input
          className={styles.search}
          placeholder="Поиск"
        />
        {/* Сюда можно добавить список чатов */}
      </div>

      {/* Main Area */}
      <div className={styles.main}>
        {/* Top nav */}
        <div className={styles.navbar}>
          <span>Связаться с нами</span>
          <span>Помощь</span>
          <span>Поддержка клиентов</span>
          <img
            src="/user-avatar.png"
            alt="Аватар"
            className={styles.avatar}
          />
        </div>

        {/* Chat content */}
        <div className={styles.chatBox}>
          {messages.map((msg, i) => (
            <div key={i} className={styles.message}>{msg}</div>
          ))}
        </div>

        {/* Input */}
        <form className={styles.inputBar} onSubmit={sendMessage}>
          <input
            className={styles.input}
            placeholder="Введите запрос"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className={styles.sendBtn} type="submit">
            &gt;
          </button>
        </form>
      </div>
    </div>
  );
}
