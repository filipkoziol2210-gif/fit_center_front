export default function TrainingPage({ changePage }) {
  const sections = [
    {
      number: "01",
      icon: "📋",
      title: "Plan treningowy",
      description: "Twórz własny plan i rozplanuj treningi na cały tydzień.",
      button: "Otwórz plan",
      page: "trainingPlan",
    },
    {
      number: "02",
      icon: "💪",
      title: "Ćwiczenia",
      description: "Dodawaj ćwiczenia, kategorie, serie i powtórzenia.",
      button: "Zobacz ćwiczenia",
      page: "exercises",
    },
    {
      number: "03",
      icon: "🕒",
      title: "Historia treningów",
      description: "Zapisuj wykonane treningi i przeglądaj wcześniejsze sesje.",
      button: "Otwórz historię",
      page: "trainingHistory",
    },
  ];

  return (
    <main className="traininghub-page">
      <div className="traininghub-container">
        <button
          className="traininghub-back"
          onClick={() => changePage("home")}
        >
          ← Strona główna
        </button>

        <div className="traininghub-heading">
          <div className="traininghub-heading-icon">🏋️</div>

          <div>
            <span className="traininghub-eyebrow">
              FIT CENTER / TWOJ TRENING
            </span>

            <h1>Trening</h1>

            <p>
              Twórz swoje treningi, zapisuj ćwiczenia i kontroluj aktywność.
            </p>
          </div>
        </div>

        <section className="traininghub-grid">
          {sections.map((section) => (
            <article className="traininghub-card" key={section.page}>
              <div className="traininghub-card-top">
                <span className="traininghub-card-icon">
                  {section.icon}
                </span>

                <span className="traininghub-card-number">
                  {section.number}
                </span>
              </div>

              <h2>{section.title}</h2>

              <p>{section.description}</p>

              <button
                className="traininghub-button"
                onClick={() => changePage(section.page)}
              >
                {section.button}
                <span>→</span>
              </button>
            </article>
          ))}
        </section>

        <div className="traininghub-note">
          <span>ⓘ</span>
          <p>
            Twoje plany i wyniki będą mogły być zapisywane na koncie
            po podłączeniu bazy danych.
          </p>
        </div>
      </div>
    </main>
  );
}
