function TrainingPage({ changePage }) {

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
          🏋️
        </div>

        <div>
          <h1>Trening</h1>

          <p>
            Twórz swoje treningi i zapisuj wyniki.
          </p>
        </div>

      </div>


      <div className="dashboard-grid">

        <div className="dashboard-box">

          <span>📋</span>

          <h3>Plan treningowy</h3>

          <p>
            Stwórz własny plan treningowy.
          </p>

          <button>Otwórz plan</button>

        </div>


        <div className="dashboard-box">

          <span>💪</span>

          <h3>Ćwiczenia</h3>

          <p>
            Dodawaj ćwiczenia, serie i powtórzenia.
          </p>

          <button>Ćwiczenia</button>

        </div>


        <div className="dashboard-box">

          <span>🕒</span>

          <h3>Historia</h3>

          <p>
            Przeglądaj swoje poprzednie treningi.
          </p>

          <button>Historia treningów</button>

        </div>

      </div>

    </main>
  );
}

export default TrainingPage;