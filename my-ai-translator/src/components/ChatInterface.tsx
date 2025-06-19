import React, { useState, useRef } from "react";
import styles from "./ChatInterface.module.css";
import attachIcon from "../assets/attachment_icon_259173 1.png";
import chatIcon from "../assets/chat_bubble_conversation_contact_icon_264230 1.png";
import avatarImage from "../assets/contacts_profile_account_connection_icon_124666 1.png";
import UserMenu from "../components/UserMenu";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Chat = {
  id: string;
  title: string;
  messages: (string | FileMessage | DownloadMessage)[];
  isEditing?: boolean;
};

type FileMessage = {
  type: "file";
  name: string;
  fileType: string;
};

type DownloadMessage = {
  type: "download";
  url: string;
};

const API_BASE = "http://localhost:8001";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [progress, setProgress] = useState<number | null>(null);
  const [model, setModel] = useState<string>("model");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const currentChat = chats.find((chat) => chat.id === selectedChatId);

  const handleFileClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };
  const handleRemoveFile = () => setAttachedFile(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      setAttachedFile(e.dataTransfer.files[0]);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Вы не авторизованы");

    const newMessageParts: (string | FileMessage | DownloadMessage)[] = [];

    try {
      if (message.trim()) {
        newMessageParts.push(message);
        const res = await axios.post(`${API_BASE}/translate`, {
          token,
          text: message,
          method: model,
        });
        newMessageParts.push(res.data.translation || "(перевод недоступен)");
      }

      if (attachedFile) {
        newMessageParts.push({
          type: "file",
          name: attachedFile.name,
          fileType: attachedFile.type,
        });

        const formData = new FormData();
        formData.append("file", attachedFile);

        const res = await axios.post(`${API_BASE}/translate-file`, formData, {
          params: { token, method: "google" },
          headers: { "Content-Type": "multipart/form-data" },
        });

        const taskId = res.data.task_id || res.data.taskId;
        newMessageParts.push("Файл отправлен на перевод");

        if (taskId) {
          let currentProgress = 5;
          setProgress(currentProgress);
          const currentChatId = selectedChatId;

          const interval = setInterval(async () => {
            try {
              if (currentProgress < 95) {
                currentProgress += 5;
                setProgress(currentProgress);
              }

              const response = await fetch(`${API_BASE}/download-translated-file?task_id=${taskId}`);
              if (response.ok) {
                clearInterval(interval);
                setProgress(null);
                const link = `${API_BASE}/download-translated-file?task_id=${taskId}`;
                const downloadMessage: DownloadMessage = { type: "download", url: link };

                setChats((prev) =>
                  prev.map((chat) =>
                    chat.id === currentChatId
                      ? { ...chat, messages: [...chat.messages, downloadMessage] }
                      : chat
                  )
                );
              }
            } catch {
              // можно логировать ошибки
            }
          }, 5000);
        }
      }

      if (!selectedChatId) {
        const newId = crypto.randomUUID();
        const newChat: Chat = {
          id: newId,
          title: message || attachedFile?.name || "Новый чат",
          messages: newMessageParts,
        };
        setChats([newChat, ...chats]);
        setSelectedChatId(newId);
      } else {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChatId
              ? { ...chat, messages: [...chat.messages, ...newMessageParts] }
              : chat
          )
        );
      }

      setMessage("");
      setAttachedFile(null);
      setRequestCount((prev) => prev + 1);
    } catch (err: any) {
      alert("Ошибка: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div
      className={styles.container}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && <div className={styles.dropOverlay}>Отпустите файл здесь</div>}

      {progress !== null && (
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          <span className={styles.progressText}>{progress}%</span>
        </div>
      )}

      <div className={styles.modelSelectWrapper}>
        <label>Модель перевода:</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="model">TranslatorPro</option>
          <option value="google">Google Translate</option>
        </select>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>AI Translator</h2>
          <button className={styles.newChatBtn} onClick={() => {
            const newId = crypto.randomUUID();
            const newChat: Chat = {
              id: newId,
              title: `Чат ${chats.length + 1}`,
              messages: [],
            };
            setChats([newChat, ...chats]);
            setSelectedChatId(newId);
          }}>
            <img src={chatIcon} alt="Новый чат" />
          </button>
        </div>

        <input className={styles.search} placeholder="Поиск" />

        <div className={styles.chatList}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${chat.id === selectedChatId ? styles.activeChat : ""}`}
            >
              <span onClick={() => setSelectedChatId(chat.id)}>{chat.title}</span>
              <div className={styles.chatActions}>
                <button onClick={() => {
                  setChats(chats.filter(c => c.id !== chat.id));
                  if (chat.id === selectedChatId) setSelectedChatId(null);
                }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.navbar}>
          <span>Связаться с нами</span>
          <span>Помощь</span>
          <span>Поддержка клиентов</span>
          <div className={styles.avatarWrapper}>
            <img
              src={avatarImage}
              alt="Профиль"
              className={styles.avatar}
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <UserMenu
                onLogout={() => {
                  setShowMenu(false);
                  navigate("/");
                }}
              />
            )}
          </div>
        </div>

        <div className={styles.chatBox}>
          {currentChat ? (
            currentChat.messages.map((msg, i) =>
              typeof msg === "string" ? (
                <div key={i} className={styles.message}>{msg}</div>
              ) : msg.type === "file" ? (
                <div key={i} className={styles.fileMessage}>
                  <div className={styles.fileIcon}>📄</div>
                  <div className={styles.fileInfo}>
                    <strong>{msg.name}</strong>
                    <span>{msg.fileType || "Файл"}</span>
                  </div>
                </div>
              ) : msg.type === "download" ? (
                <div key={i} className={styles.message} style={{ animation: "fadeIn 0.6s ease-in-out" }}>
                  <div className={styles.downloadMessage}>
                    <span>✅ Перевод завершён</span>
                    <a
                      href={msg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadLink}
                    >
                      📎 Скачать переведённый файл
                    </a>
                    <button
                      onClick={() => window.open(msg.url, '_blank')}
                      className={styles.openNowBtn}
                    >
                      🔍 Открыть сейчас
                    </button>
                  </div>
                </div>
              ) : null
            )
          ) : (
            <p className={styles.noChat}>Начните чат</p>
          )}
        </div>

        <form className={styles.inputBar} onSubmit={sendMessage}>
          {attachedFile && (
            <div className={styles.filePreview}>
              <div className={styles.fileIcon}>📄</div>
              <div className={styles.fileInfo}>
                <strong>{attachedFile.name}</strong>
                <span>{attachedFile.type || "Файл"}</span>
              </div>
              <button type="button" onClick={handleRemoveFile}>❌</button>
            </div>
          )}

          <input
            className={styles.input}
            placeholder="Введите запрос"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="button" className={styles.attachBtn} onClick={handleFileClick}>
            <img src={attachIcon} alt="Прикрепить файл" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <button className={styles.sendBtn} type="submit">&gt;</button>
        </form>
      </div>
    </div>
  );
}
