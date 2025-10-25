import React, { useState, useEffect } from "react";
import ChatInterface from "./components/ChatInterface";
import LoginForm from "./components/LoginForm";
import { User } from "./services/api";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("nickname");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("nickname");
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="App loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <ChatInterface user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
