import { useState } from "react";
import "./App.css";

import DietPage from "./pages/DietPage";
import TrainingPage from "./pages/TrainingPage";
import ProgressPage from "./pages/ProgressPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import BMIPage from "./pages/BMIPage"
import Header from "./components/Header";

function App() {

  const [darkMode, setDarkMode] = useState(true);
  const [page, setPage] = useState("home");

  function changeTheme(mode) {
    setDarkMode(mode === "dark");
  }

  function changePage(newPage) {
    setPage(newPage);
    window.scrollTo(0, 0);
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      <Header
        darkMode={darkMode}
        changeTheme={changeTheme}
        changePage={changePage}
      />

      {page === "home" && (
        <HomePage changePage={changePage} />
      )}

      {page === "bmi" && (
        <BMIPage changePage={changePage} />
      )}

      {page === "diet" && (
        <DietPage changePage={changePage} />
      )}

      {page === "training" && (
        <TrainingPage changePage={changePage} />
      )}

      {page === "progress" && (
        <ProgressPage changePage={changePage} />
      )}

      {page === "login" && (
        <LoginPage changePage={changePage} />
      )}

      {page === "register" && (
        <RegisterPage changePage={changePage} />
      )}

    </div>
  );
}


/* =========================
   STRONA GŁÓWNA
   ========================= */

function HomePage({ changePage }) {

  return (
    <>

      <main>

        <div className="title">

          <h1>TWÓJ PANEL FITNESS</h1>

          <p>
            Kontroluj trening, dietę i swoje postępy
          </p>

        </div>


        <div className="cards">

          {/* DIETA */}

          <div className="card">

            <div className="icon">🥗</div>

            <h2>Dieta</h2>

            <p>Kalorie</p>
            <p>Posiłki</p>
            <p>Makroskładniki</p>

            <button
              onClick={() => changePage("diet")}
            >
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

            <button
              onClick={() => changePage("training")}
            >
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

            <button
              onClick={() => changePage("progress")}
            >
              Otwórz
            </button>

          </div>

        </div>

      </main>


      {/* LOGOWANIE */}

      <button
        className="login"
        onClick={() => changePage("login")}
      >
        👤
        <span>Zaloguj</span>
      </button>

    </>
  );
}


export default App;