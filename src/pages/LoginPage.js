import { useState } from "react";
import logo from "../ikonka.png";

function LoginPage({ users = [], changePage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    const found = users.find((u) => u.email === email);
    if (found) {
      changePage("home");
    } else {
      setError("Nie znaleziono użytkownika o podanym adresie e-mail.");
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <img
          src={logo}
          alt="Fit Center logo"
          className="login-logo"
        />

        <h1>Witaj ponownie</h1>

        <p className="login-description">
          Zaloguj się do swojego konta Fit Center
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Adres e-mail</label>
            <input
              type="email"
              placeholder="twoj@email.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Hasło</label>
            <input
              type="password"
              placeholder="Wpisz hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              Zapamiętaj mnie
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Nie pamiętasz hasła?
            </button>
          </div>

          {error && <p className="error-message" style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

          <button
            type="submit"
            className="login-submit"
          >
            Zaloguj się
          </button>
        </form>

        <div className="separator">
          <span></span>
          <p>lub</p>
          <span></span>
        </div>

        <button
          type="button"
          className="google-login"
        >
          <span className="google-logo">
            G
          </span>
          Kontynuuj z Google
        </button>

        <p className="register-text">
          Nie masz jeszcze konta?
          <button
            type="button"
            onClick={() => changePage("register")}
          >
            Zarejestruj się
          </button>
        </p>

        <button
          type="button"
          className="back-button"
          onClick={() => changePage("home")}
        >
          ← Powrót do strony głównej
        </button>
      </div>
    </main>
  );
}

export default LoginPage;