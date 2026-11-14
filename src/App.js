
import { useState } from "react";
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

import TrainingPlanPage from "./pages/TrainingPlanPage";
import ExercisesPage from "./pages/ExercisesPage";
import TrainingHistoryPage from "./pages/TrainingHistoryPage";

import Header from "./components/Header";
import { apiJson } from "./api";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [page, setPage] = useState("home");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authError, setAuthError] = useState("");

  function changeTheme(mode) {
    setDarkMode(mode === "dark");
  }

  function changePage(newPage) {
    setPage(newPage);
    window.scrollTo(0, 0);
  }

  async function handleLogout() {
    setAuthError("");

    try {
      await apiJson("/api/logout/", { method: "POST" });
      setLoggedInUser(null);
      localStorage.removeItem("userId");
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

      {/* BMI */}
      {page === "bmi" && (
        <BMIPage changePage={changePage} />
      )}

      {/* DIETA */}
      {page === "diet" && (
        <DietPage changePage={changePage} />
      )}

      {page === "calories" && (
        <CaloriesPage changePage={changePage} />
      )}

      {page === "meals" && (
        <MealsPage changePage={changePage} />
      )}

      {page === "macros" && (
        <MacrosPage changePage={changePage} />
      )}

      {/* TRENING */}
      {page === "training" && (
        <TrainingPage changePage={changePage} />
      )}

      {page === "trainingPlan" && (
        <TrainingPlanPage changePage={changePage} />
      )}

      {page === "exercises" && (
        <ExercisesPage changePage={changePage} />
      )}

      {page === "trainingHistory" && (
        <TrainingHistoryPage changePage={changePage} />
      )}

      {/* POSTĘPY */}
      {page === "progress" && (
        <ProgressPage changePage={changePage} />
      )}

      {/* LOGOWANIE */}
      {page === "login" && (
        <LoginPage
          changePage={changePage}
          setLoggedInUser={setLoggedInUser}
        />
      )}

      {/* REJESTRACJA */}
      {page === "register" && (
        <RegisterPage
          changePage={changePage}
          setLoggedInUser={setLoggedInUser}
        />
      )}
    </div>
  );
}


/* =========================
   STRONA GŁÓWNA
========================= */

function HomePage({ changePage, loggedInUser, handleLogout }) {
  return (
    <>
      <main>
        <div className="title">
          <h1>TWÓJ PANEL FITNESS</h1>
          <p>Kontroluj trening, dietę i swoje postępy</p>
        </div>

        <div className="cards">

          {/* DIETA */}
          <div className="card">
            <div className="icon">🥗</div>
            <h2>Dieta</h2>
            <p>Kalorie</p>
            <p>Posiłki</p>
            <p>Makroskładniki</p>

            <button onClick={() => changePage("diet")}>
              Otwórz
            </button>
          </div>

          {/* TRENING */}
          <div className="card">
            <div className="icon">🏋️</div>
            <h2>Trening</h2>
            <p>Plan treningowy</p>
            <p>Ćwiczenia</p>
            <p>Historia treningów</p>

            <button onClick={() => changePage("training")}>
              Otwórz
            </button>
          </div>

          {/* POSTĘPY */}
          <div className="card">
            <div className="icon">📈</div>
            <h2>Postępy</h2>
            <p>Waga</p>
            <p>Rekordy</p>
            <p>Wykresy postępów</p>

            <button onClick={() => changePage("progress")}>
              Otwórz
            </button>
          </div>

        </div>
      </main>

      {/* LOGOWANIE I WYLOGOWYWANIE */}
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
        <button
          className="login"
          onClick={() => changePage("login")}
        >
          👤
          <span>Zaloguj</span>
        </button>
      )}
    </>
  );
}

export default App;
