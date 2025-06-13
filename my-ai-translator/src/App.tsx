import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import RegisterPage from "./pages/RegisterPage"; 

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/register" element={<RegisterPage />} /> 
    </Routes>
  );
}
