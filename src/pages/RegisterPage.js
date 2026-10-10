import { useState } from "react";
import logo from "../ikonka.png";

function RegisterPage({ changePage }) {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");


  function register(e) {

    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Hasła nie są takie same");
      return;
    }

    setError("");

    alert("Hasła są poprawne!");
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
            />

          </div>


          <div className="input-group">

            <label>Adres e-mail</label>

            <input
              type="email"
              placeholder="twoj@email.pl"
            />

          </div>


          <div className="input-group">

            <label>Hasło</label>

            <input
              type="password"
              placeholder="Wpisz hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>


          <div className="input-group">

            <label>Powtórz hasło</label>

            <input
              type="password"
              placeholder="Powtórz hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

          </div>


          {error && (
            <p className="register-error">
              {error}
            </p>
          )}


          <label className="terms">

            <input type="checkbox" />

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