import React, { useState, useRef } from "react";
import styles from "./ChatInterface.module.css";
import attachIcon from "../assets/attachment_icon_259173 1.png";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, message]);
    setMessage("");
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      alert(`Файл выбран: ${file.name}`);
    }
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      alert(`Файл перетащен: ${file.name}`);
    }
  };

  return (
    <div
      className={styles.container}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop-зона визуально */}
      {isDragging && (
        <div className={styles.dropOverlay}>
          Отпустите файл здесь
        </div>
      )}

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.logo}>AI Translator</h2>
        <input className={styles.search} placeholder="Поиск" />
      </div>

      {/* Main Area */}
      <div className={styles.main}>
        {/* Navbar */}
        <div className={styles.navbar}>
          <span>Связаться с нами</span>
          <span>Помощь</span>
          <span>Поддержка клиентов</span>
          <img
            src="my-ai-translator/src/assets/contacts_profile_account_connection_icon_124666 1.png"
            alt="Аватар"
            className={styles.avatar}
          />
        </div>

        {/* Chat Box */}
        <div className={styles.chatBox}>
          {messages.map((msg, i) => (
            <div key={i} className={styles.message}>
              {msg}
            </div>
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

          <button
            type="button"
            className={styles.attachBtn}
            onClick={handleFileClick}
          >
            <img src={attachIcon} alt="Прикрепить файл" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <button className={styles.sendBtn} type="submit">
            &gt;
          </button>
        </form>
      </div>
    </div>
  );
}
