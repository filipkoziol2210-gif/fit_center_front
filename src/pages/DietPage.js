function DietPage({ changePage }) {

  return (
    <main className="diet-page">

      <button
        className="page-back"
        onClick={() => changePage("home")}
      >
        ← Strona główna
      </button>

      <div className="diet-heading">
        <div>
          <span className="diet-eyebrow">FIT CENTER / TWOJA DIETA</span>
          <h1>Strefa żywienia</h1>
          <p>
            Zarządzaj posiłkami i sprawdzaj informacje
            o swoim odżywianiu.
          </p>
        </div>

        <div className="diet-heading-icon">🥗</div>
      </div>

      <div className="diet-menu">

        <div className="diet-menu-card calories-card">
          <div className="diet-card-top">
            <span className="diet-card-icon">🔥</span>
            <span className="diet-card-number">01</span>
          </div>

          <h2>Kalorie</h2>
          <p>
            Dodawaj produkty i sprawdzaj ich wartość
            energetyczną.
          </p>

          <button onClick={() => changePage("calories")}>
            Otwórz bilans <span>→</span>
          </button>
        </div>

        <div className="diet-menu-card meals-card">
          <div className="diet-card-top">
            <span className="diet-card-icon">🍽️</span>
            <span className="diet-card-number">02</span>
          </div>

          <h2>Posiłki</h2>
          <p>
            Twórz dziennik posiłków i zapisuj to,
            co zostało zjedzone.
          </p>

          <button onClick={() => changePage("meals")}>
            Otwórz dziennik <span>→</span>
          </button>
        </div>

        <div className="diet-menu-card macros-card">
          <div className="diet-card-top">
            <span className="diet-card-icon">⚖️</span>
            <span className="diet-card-number">03</span>
          </div>

          <h2>Makroskładniki</h2>
          <p>
            Sprawdzaj ilość białka, tłuszczów
            i węglowodanów.
          </p>

          <button onClick={() => changePage("macros")}>
            Otwórz makro <span>→</span>
          </button>
        </div>

      </div>

      <div className="diet-bottom-note">
        <span>💡</span>
        <p>
          Twoje dane żywieniowe będą mogły być później
          zapisywane na koncie po podłączeniu bazy danych.
        </p>
      </div>

    </main>
  );
}

export default DietPage;
