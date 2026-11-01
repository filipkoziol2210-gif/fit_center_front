import { useState } from "react";
import logo from "../ikonka.png";

function RegisterPage({ changePage }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");


  async function register(e) {

    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Hasła nie są takie same");
      return;
    }

    setError("");

    const apiUrl = import.meta.env.VITE_API_URL || "https://fit-center-u3un.onrender.com";

    try {
      const response = await fetch(`${apiUrl}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        changePage("login");
      } else {
        setError(data.error || "Błąd rejestracji.");
      }
    } catch (err) {
      setError("Błąd połączenia z serwerem.");
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

        <h1>Utwórz konto</h1>

        <p className="login-description">
          Załóż konto i zacznij korzystać z Fit Center
        </p>


        <form onSubmit={register}>

          <div className="input-group">

            <label>Imię</label>

            <input
              type="text"
              placeholder="Wpisz swoje imię"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

          </div>


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


          <div className="input-group">

            <label>Powtórz hasło</label>

            <input
              type="password"
              placeholder="Powtórz hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

          </div>


          {error && (
            <p className="register-error" style={{ color: "red", marginBottom: "1rem" }}>
              {error}
            </p>
          )}


          <label className="terms">

            <input type="checkbox" required />

            <span>
              Akceptuję regulamin Fit Center
            </span>

          </label>


          <button
            type="submit"
            className="login-submit"
          >
            Utwórz konto
          </button>

        </form>


        <p className="register-text">

          Masz już konto?

          <button
            type="button"
            onClick={() => changePage("login")}
          >
            Zaloguj się
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

export default RegisterPage;