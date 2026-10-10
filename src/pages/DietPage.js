function DietPage({ changePage }) {

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
          🥗
        </div>

        <div>
          <h1>Dieta</h1>

          <p>
            Kontroluj swoją dietę i dzienne spożycie.
          </p>
        </div>

      </div>


      <div className="dashboard-grid">

        <div className="dashboard-box">

          <span>🔥</span>

          <h3>Kalorie</h3>

          <p>
            Sprawdzaj dzienne spożycie kalorii.
          </p>

          <button>Zobacz kalorie</button>

        </div>


        <div className="dashboard-box">

          <span>🍽️</span>

          <h3>Posiłki</h3>

          <p>
            Dodawaj i przeglądaj swoje posiłki.
          </p>

          <button>Zobacz posiłki</button>

        </div>


        <div className="dashboard-box">

          <span>🥩</span>

          <h3>Makroskładniki</h3>

          <p>
            Kontroluj białko, tłuszcze i węglowodany.
          </p>

          <button>Zobacz makro</button>

        </div>

      </div>

    </main>
  );
}

export default DietPage;