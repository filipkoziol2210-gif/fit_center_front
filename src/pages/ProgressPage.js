function ProgressPage({ changePage }) {

  return (
    <main className="subpage">

      <button
        className="page-back"
        onClick={() => changePage("home")}
      >
        ← Strona główna
      </button>


      <div className="subpage-title">

        <div className="subpage-icon">
          📈
        </div>

        <div>
          <h1>Postępy</h1>

          <p>
            Obserwuj swoje wyniki i rozwój.
          </p>
        </div>

      </div>


      <div className="dashboard-grid">

        <div className="dashboard-box">

          <span>⚖️</span>

          <h3>Waga</h3>

          <p>
            Zapisuj i kontroluj zmiany swojej wagi.
          </p>

          <button>Zobacz wagę</button>

        </div>


        <div className="dashboard-box">

          <span>🏆</span>

          <h3>Rekordy</h3>

          <p>
            Zapisuj swoje najlepsze wyniki.
          </p>

          <button>Moje rekordy</button>

        </div>


        <div className="dashboard-box">

          <span>📊</span>

          <h3>Wykresy</h3>

          <p>
            Sprawdzaj swoje postępy na wykresach.
          </p>

          <button>Zobacz wykresy</button>

        </div>

      </div>

    </main>
  );
}

export default ProgressPage;