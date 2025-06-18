import React, { useState, useRef } from "react";
import styles from "./ChatInterface.module.css";
import attachIcon from "../assets/attachment_icon_259173 1.png";
import chatIcon from "../assets/chat_bubble_conversation_contact_icon_264230 1.png";
import { FaUserCircle } from "react-icons/fa";

type Chat = {
  id: string;
  title: string;
  messages: (string | FileMessage)[];
  isEditing?: boolean;
};

type FileMessage = {
  type: "file";
  name: string;
  fileType: string;
};

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !attachedFile) return;

    const newMessageParts: (string | FileMessage)[] = [];

    if (message.trim()) newMessageParts.push(message);
    if (attachedFile) {
      newMessageParts.push({
        type: "file",
        name: attachedFile.name,
        fileType: attachedFile.type,
      });
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
  };

  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    const newChat: Chat = {
      id: newId,
      title: `Чат ${chats.length + 1}`,
      messages: [],
    };
    setChats([newChat, ...chats]);
    setSelectedChatId(newId);
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (id === selectedChatId) setSelectedChatId(null);
  };

  const handleEditChat = (id: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, isEditing: true } : { ...chat, isEditing: false }
      )
    );
  };

  const handleChangeTitle = (id: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const handleTitleSubmit = (id: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, isEditing: false } : chat
      )
    );
  };

  return (
    <div
      className={styles.container}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && <div className={styles.dropOverlay}>Отпустите файл здесь</div>}

      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>AI Translator</h2>
          <button className={styles.newChatBtn} onClick={handleNewChat}>
            <img src={chatIcon} alt="Новый чат" />
          </button>
        </div>

        <input className={styles.search} placeholder="Поиск" />

        <div className={styles.chatList}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${
                chat.id === selectedChatId ? styles.activeChat : ""
              }`}
            >
              {chat.isEditing ? (
                <input
                  className={styles.chatEditInput}
                  value={chat.title}
                  onChange={(e) => handleChangeTitle(chat.id, e.target.value)}
                  onBlur={() => handleTitleSubmit(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSubmit(chat.id);
                  }}
                  autoFocus
                />
              ) : (
                <span onClick={() => setSelectedChatId(chat.id)}>{chat.title}</span>
              )}

              <div className={styles.chatActions}>
                <button onClick={() => handleEditChat(chat.id)}>✏️</button>
                <button onClick={() => handleDeleteChat(chat.id)}>🗑</button>
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
          <FaUserCircle className={styles.avatar} size={32} />
        </div>

        <div className={styles.chatBox}>
          {currentChat ? (
            currentChat.messages.map((msg, i) =>
              typeof msg === "string" ? (
                <div key={i} className={styles.message}>{msg}</div>
              ) : (
                <div key={i} className={styles.fileMessage}>
                  <div className={styles.fileIcon}>📄</div>
                  <div className={styles.fileInfo}>
                    <strong>{msg.name}</strong>
                    <span>{msg.fileType || "Файл"}</span>
                  </div>
                </div>
              )
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
