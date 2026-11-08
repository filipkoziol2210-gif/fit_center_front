export default function DietPage({ changePage }) {
  const sections = [
    {
      number: "01",
      icon: "🔥",
      title: "Bilans kalorii",
      description: "Dodawaj produkty i kontroluj ich wartość energetyczną.",
      button: "Otwórz bilans",
      page: "calories",
    },
    {
      number: "02",
      icon: "🍽️",
      title: "Dziennik posiłków",
      description: "Zapisuj posiłki i porządkuj je według pory dnia.",
      button: "Otwórz dziennik",
      page: "meals",
    },
    {
      number: "03",
      icon: "⚖️",
      title: "Makroskładniki",
      description: "Analizuj ilość białka, tłuszczów i węglowodanów.",
      button: "Sprawdź makro",
      page: "macros",
    },
  ];

  return (
    <main className="nutrition-page">
      <div className="nutrition-container">
        <button
          className="nutrition-back-link"
          onClick={() => changePage("home")}
        >
          ← Strona główna
        </button>

        <header className="nutrition-heading">
          <div className="nutrition-heading-icon">🥗</div>

          <div>
            <h1>Dieta</h1>
            <p>Zarządzaj posiłkami i sprawdzaj informacje o swoim odżywianiu.</p>
          </div>
        </header>

        <section className="nutrition-card-grid">
          {sections.map((section) => (
            <article className="nutrition-menu-card" key={section.page}>
              <div className="nutrition-card-top">
                <span className="nutrition-card-icon">{section.icon}</span>
                <span className="nutrition-card-number">
                  {section.number}
                </span>
              </div>

              <h2>{section.title}</h2>
              <p>{section.description}</p>

              <button
                className="nutrition-primary-button"
                onClick={() => changePage(section.page)}
              >
                {section.button} <span>→</span>
              </button>
            </article>
          ))}
        </section>

        <div className="nutrition-info">
          <span className="nutrition-info-icon">ⓘ</span>
          <p>
            Dane żywieniowe będą mogły być zapisywane na koncie użytkownika
            po podłączeniu bazy danych.
          </p>
        </div>
      </div>
    </main>
  );
}
