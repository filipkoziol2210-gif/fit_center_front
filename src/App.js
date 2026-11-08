import { useEffect, useState } from "react";
import "./App.css";

import DietPage from "./pages/DietPage";
import TrainingPage from "./pages/TrainingPage";
import ProgressPage from "./pages/ProgressPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CaloriesPage from "./pages/CaloriesPage";
import MealsPage from "./pages/MealsPage";
import MacrosPage from "./pages/MacrosPage";
import BMIPage from "./pages/BMIPage";
import Header from "./components/Header";
import { apiJson } from "./api";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [page, setPage] = useState("home");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authError, setAuthError] = useState("");

  // Odtwórz stan zalogowania z cookie sesji po odświeżeniu strony.
  useEffect(() => {
    let active = true;

    apiJson("/api/session/")
      .then((data) => {
        if (active && data.authenticated) {
          setLoggedInUser(data.email);
        }
      })
      .catch((error) => {
        // Błąd pobierania sesji nie powinien blokować publicznej strony głównej.
        console.warn("SESSION CHECK:", error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  function changeTheme(mode) {
    setDarkMode(mode === "dark");
  }

  function changePage(newPage) {
    setPage(newPage);
    setAuthError("");
    window.scrollTo(0, 0);
  }

  async function handleLogout() {
    setAuthError("");

    try {
      await apiJson("/api/logout/", { method: "POST" });
      setLoggedInUser(null);
      changePage("home");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setAuthError(error.message || "Nie udało się wylogować.");
    }
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <Header
        darkMode={darkMode}
        changeTheme={changeTheme}
        changePage={changePage}
      />

      {authError && (
        <p role="alert" className="error-message">
          {authError}
        </p>
      )}

      {page === "home" && (
        <HomePage
          changePage={changePage}
          loggedInUser={loggedInUser}
          handleLogout={handleLogout}
        />
      )}

      {page === "bmi" && <BMIPage changePage={changePage} />}
      {page === "diet" && <DietPage changePage={changePage} />}
      {page === "calories" && <CaloriesPage changePage={changePage} />}
      {page === "meals" && <MealsPage changePage={changePage} />}
      {page === "macros" && <MacrosPage changePage={changePage} />}
      {page === "training" && <TrainingPage changePage={changePage} />}
      {page === "progress" && <ProgressPage changePage={changePage} />}

      {page === "login" && (
        <LoginPage
          changePage={changePage}
          setLoggedInUser={setLoggedInUser}
        />
      )}

      {page === "register" && (
        <RegisterPage
          changePage={changePage}
          setLoggedInUser={setLoggedInUser}
        />
      )}
    </div>
  );
}

function HomePage({ changePage, loggedInUser, handleLogout }) {
  return (
    <>
      <main>
        <div className="title">
          <h1>TWÓJ PANEL FITNESS</h1>
          <p>Kontroluj trening, dietę i swoje postępy</p>
        </div>

        <div className="cards">
          <div className="card">
            <div className="icon">🥗</div>
            <h2>Dieta</h2>
            <p>Kalorie</p>
            <p>Posiłki</p>
            <p>Makroskładniki</p>
            <button onClick={() => changePage("diet")}>Otwórz</button>
          </div>

          <div className="card">
            <div className="icon">🏋️</div>
            <h2>Trening</h2>
            <p>Plan treningowy</p>
            <p>Ćwiczenia</p>
            <p>Historia treningów</p>
            <button onClick={() => changePage("training")}>Otwórz</button>
          </div>

          <div className="card">
            <div className="icon">📈</div>
            <h2>Postępy</h2>
            <p>Waga</p>
            <p>Rekordy</p>
            <p>Wykresy postępów</p>
            <button onClick={() => changePage("progress")}>Otwórz</button>
          </div>
        </div>
      </main>

      {loggedInUser ? (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 1000,
          }}
        >
          <span>Witaj, {loggedInUser}</span>
          <button
            className="login"
            onClick={handleLogout}
            style={{ position: "static" }}
          >
            <span>Wyloguj</span>
          </button>
        </div>
      ) : (
        <button className="login" onClick={() => changePage("login")}>
          👤
          <span>Zaloguj</span>
        </button>
      )}
    </>
  );
}

export default App;
