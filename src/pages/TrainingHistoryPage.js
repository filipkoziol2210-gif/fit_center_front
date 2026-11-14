import { useState } from "react";

export default function TrainingHistoryPage({ changePage }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [sessions, setSessions] = useState([]);

  const totalMinutes = sessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  const sortedSessions = [...sessions].sort(
    (a, b) => b.date.localeCompare(a.date)
  );

  function addSession(e) {
    e.preventDefault();

    if (
      !name.trim() ||
      !date ||
      Number(duration) < 1
    ) {
      return;
    }

    setSessions([
      ...sessions,
      {
        id: Date.now(),
        name: name.trim(),
        date,
        duration: Number(duration),
        description: description.trim(),
      },
    ]);

    setName("");
    setDate("");
    setDuration("");
    setDescription("");
  }

  function removeSession(id) {
    setSessions(
      sessions.filter((session) => session.id !== id)
    );
  }

  function formatDate(value) {
    return new Date(`${value}T00:00:00`).toLocaleDateString(
      "pl-PL",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  return (
    <main className="traininghub-subpage">
      <div className="traininghub-container">
        <button
          className="traininghub-back"
          onClick={() => changePage("training")}
        >
          ← Powrót do treningu
        </button>

        <div className="traininghub-heading">
          <div className="traininghub-heading-icon history-icon">🕒</div>

          <div>
            <span className="traininghub-eyebrow">TWOJA AKTYWNOŚĆ</span>
            <h1>Historia treningów</h1>
            <p>Przeglądaj zapisane sesje i sprawdzaj swoją aktywność.</p>
          </div>
        </div>

        <section className="traininghub-history-stats">
          <div className="traininghub-stat-card">
            <span className="traininghub-stat-icon">📋</span>
            <div>
              <span>Liczba treningów</span>
              <strong>{sessions.length}</strong>
            </div>
          </div>

          <div className="traininghub-stat-card">
            <span className="traininghub-stat-icon">⏱️</span>
            <div>
              <span>Łączny czas</span>
              <strong>
                {Math.floor(totalMinutes / 60)} h {totalMinutes % 60} min
              </strong>
            </div>
          </div>
        </section>

        <section className="traininghub-workspace history-workspace">
          <div className="traininghub-panel history-form-panel">
            <div className="traininghub-panel-heading">
              <span className="traininghub-panel-icon">＋</span>
              <div>
                <h2>Zapisz trening</h2>
                <p>Dodaj informacje o zakończonej sesji.</p>
              </div>
            </div>

            <form className="traininghub-form" onSubmit={addSession}>
              <label htmlFor="history-name">Nazwa treningu</label>
              <input
                id="history-name"
                type="text"
                placeholder="Np. Trening całego ciała"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label htmlFor="history-date">Data</label>
              <input
                id="history-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <label htmlFor="history-duration">Czas trwania</label>
              <div className="traininghub-input-unit">
                <input
                  id="history-duration"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Np. 60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
                <span>min</span>
              </div>

              <label htmlFor="history-description">Notatka (opcjonalnie)</label>
              <textarea
                id="history-description"
                rows="3"
                placeholder="Dodatkowe informacje..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button className="traininghub-button" type="submit">
                Zapisz trening <span>＋</span>
              </button>
            </form>
          </div>

          <div className="traininghub-panel history-list-panel">
            <div className="traininghub-panel-heading">
              <span className="traininghub-panel-icon">☷</span>
              <div>
                <h2>Ostatnie treningi</h2>
                <p>Twoje zapisane sesje.</p>
              </div>
              <span className="traininghub-count">{sessions.length}</span>
            </div>

            {sessions.length === 0 ? (
              <div className="traininghub-empty">
                <span>🗓️</span>
                <h3>Brak zapisanych treningów</h3>
                <p>Dodaj swoją pierwszą sesję za pomocą formularza.</p>
              </div>
            ) : (
              <div className="traininghub-history-list">
                {sortedSessions.map((session) => (
                  <article
                    className="traininghub-history-entry"
                    key={session.id}
                  >
                    <div className="traininghub-history-date">
                      <span>📅</span>
                      {formatDate(session.date)}
                    </div>

                    <div className="traininghub-history-content">
                      <strong>{session.name}</strong>

                      {session.description && (
                        <p>{session.description}</p>
                      )}

                      <span className="traininghub-duration">
                        ⏱ {session.duration} min
                      </span>
                    </div>

                    <button
                      className="traininghub-delete"
                      onClick={() => removeSession(session.id)}
                      title="Usuń wpis"
                      aria-label={`Usuń ${session.name}`}
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
