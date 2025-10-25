import React, { useState, useEffect } from "react";
import { apiService, User } from "../services/api";
import "./LoginForm.css";

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [nickname, setNickname] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    message: string;
  } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    // Only check availability in registration mode
    if (!isRegistering) {
      setAvailability(null);
      return;
    }

    const checkAvailability = async () => {
      if (nickname.trim().length >= 2) {
        setCheckingAvailability(true);
        try {
          const result = await apiService.checkNicknameAvailability(
            nickname.trim()
          );
          setAvailability({
            available: result.available,
            message: result.message,
          });
        } catch (error) {
          console.error("Error checking availability:", error);
        } finally {
          setCheckingAvailability(false);
        }
      } else {
        setAvailability(null);
      }
    };

    const timer = setTimeout(() => {
      checkAvailability();
    }, 500);

    return () => clearTimeout(timer);
  }, [nickname, isRegistering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    if (nickname.trim().length < 2) {
      setError("Nickname must be at least 2 characters long");
      return;
    }

    if (nickname.trim().length > 50) {
      setError("Nickname must not exceed 50 characters");
      return;
    }

    setIsLoading(true);

    try {
      let user: User;

      if (isRegistering) {
        user = await apiService.registerUser(nickname.trim());
      } else {
        user = await apiService.loginUser(nickname.trim());
      }

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("nickname", user.nickname);

      onLogin(user);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
    setAvailability(null);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/image.png" alt="Logo" className="login-logo" />
          <h1>Duygu Analizi Sohbet</h1>
          <p>
            {isRegistering
              ? "Hesap oluşturun ve sohbete başlayın"
              : "Giriş yapın ve sohbete başlayın"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="nickname">Kullanıcı Adı</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              className={
                availability
                  ? availability.available
                    ? "valid"
                    : "invalid"
                  : ""
              }
              disabled={isLoading}
              autoFocus
            />
            {availability && (
              <div
                className={`availability-message ${
                  availability.available ? "available" : "taken"
                }`}
              >
                {checkingAvailability
                  ? "Kontrol ediliyor..."
                  : availability.message}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !nickname.trim()}
            className="submit-button"
          >
            {isLoading ? (
              <div className="button-spinner"></div>
            ) : isRegistering ? (
              "Kayıt Ol"
            ) : (
              "Giriş Yap"
            )}
          </button>

          <div className="toggle-mode">
            <button
              type="button"
              onClick={handleToggleMode}
              className="toggle-button"
            >
              {isRegistering ? (
                <>
                  Zaten hesabınız var mı? <strong>Giriş yap</strong>
                </>
              ) : (
                <>
                  Hesabınız yok mu? <strong>Kayıt ol</strong>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
