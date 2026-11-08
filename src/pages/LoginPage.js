import { useState } from "react";
import logo from "../ikonka.png";
import { apiJson, jsonBody } from "../api";

function LoginPage({ changePage, setLoggedInUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const data = await apiJson("/api/login/", {
        method: "POST",
        ...jsonBody({ email: normalizedEmail, password }),
      });

      if (!data.success) {
        throw new Error(data.error || "Nie udało się zalogować.");
      }

      setLoggedInUser(normalizedEmail);
      changePage("home");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.message || "Nie udało się połączyć z serwerem.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <img src={logo} alt="Fit Center logo" className="login-logo" />

        <h1>Witaj ponownie</h1>
        <p className="login-description">
          Zaloguj się do swojego konta Fit Center
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="login-email">Adres e-mail</label>
            <input
              id="login-email"
              type="email"
              placeholder="twoj@email.pl"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Hasło</label>
            <input
              id="login-password"
              type="password"
              placeholder="Wpisz hasło"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              Zapamiętaj mnie
            </label>
            <button type="button" className="forgot-password" disabled>
              Nie pamiętasz hasła?
            </button>
          </div>

          {error && (
            <p className="error-message" role="alert" style={{ color: "red", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <div className="separator">
          <span></span>
          <p>lub</p>
          <span></span>
        </div>

        <button type="button" className="google-login" disabled>
          <span className="google-logo">G</span>
          Kontynuuj z Google
        </button>

        <p className="register-text">
          Nie masz jeszcze konta?{" "}
          <button type="button" onClick={() => changePage("register")}>
            Zarejestruj się
          </button>
        </p>

        <button type="button" className="back-button" onClick={() => changePage("home")}>
          ← Powrót do strony głównej
        </button>
      </div>
    </main>
  );
}

export default LoginPage;
