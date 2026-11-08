import { useState } from "react";
import logo from "../ikonka.png";
import { apiJson, jsonBody } from "../api";

function RegisterPage({ changePage, setLoggedInUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function register(event) {
    event.preventDefault();
    if (isSubmitting) return;

    if (password !== confirmPassword) {
      setError("Hasła nie są takie same.");
      return;
    }
    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const data = await apiJson("/api/register/", {
        method: "POST",
        ...jsonBody({ name: name.trim(), email: normalizedEmail, password }),
      });

      if (!data.success) {
        throw new Error(data.error || "Rejestracja nie powiodła się.");
      }

      // Backend api_register tworzy sesję zaraz po utworzeniu konta.
      setLoggedInUser?.(normalizedEmail);
      changePage("home");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError(err.message || "Nie udało się utworzyć konta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <img src={logo} alt="Fit Center logo" className="login-logo" />

        <h1>Utwórz konto</h1>
        <p className="login-description">
          Załóż konto i zacznij korzystać z Fit Center
        </p>

        <form onSubmit={register}>
          <div className="input-group">
            <label htmlFor="register-name">Imię</label>
            <input
              id="register-name"
              type="text"
              placeholder="Wpisz swoje imię"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-email">Adres e-mail</label>
            <input
              id="register-email"
              type="email"
              placeholder="twoj@email.pl"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-password">Hasło</label>
            <input
              id="register-password"
              type="password"
              placeholder="Wpisz hasło (min. 8 znaków)"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-confirm-password">Powtórz hasło</label>
            <input
              id="register-confirm-password"
              type="password"
              placeholder="Powtórz hasło"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="register-error" role="alert" style={{ color: "red", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          <label className="terms">
            <input type="checkbox" required />
            <span>Akceptuję regulamin Fit Center</span>
          </label>

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? "Tworzenie konta..." : "Utwórz konto"}
          </button>
        </form>

        <p className="register-text">
          Masz już konto?{" "}
          <button type="button" onClick={() => changePage("login")}>
            Zaloguj się
          </button>
        </p>

        <button type="button" className="back-button" onClick={() => changePage("home")}>
          ← Powrót do strony głównej
        </button>
      </div>
    </main>
  );
}

export default RegisterPage;
