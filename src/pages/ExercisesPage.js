import { useState } from "react";

export default function ExercisesPage({ changePage }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Siłowe");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [exercises, setExercises] = useState([]);

  const categories = [
    "Siłowe",
    "Kondycyjne",
    "Mobilność",
    "Inne",
  ];

  function addExercise(e) {
    e.preventDefault();

    if (
      !name.trim() ||
      Number(sets) < 1 ||
      Number(reps) < 1
    ) {
      return;
    }

    setExercises([
      ...exercises,
      {
        id: Date.now(),
        name: name.trim(),
        category,
        sets: Number(sets),
        reps: Number(reps),
      },
    ]);

    setName("");
    setSets("3");
    setReps("10");
  }

  function removeExercise(id) {
    setExercises(
      exercises.filter((exercise) => exercise.id !== id)
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
          <div className="traininghub-heading-icon exercises-icon">💪</div>

          <div>
            <span className="traininghub-eyebrow">BAZA AKTYWNOŚCI</span>
            <h1>Ćwiczenia</h1>
            <p>Twórz własną listę ćwiczeń i zapisuj ich parametry.</p>
          </div>
        </div>

        <section className="traininghub-summary exercises-summary">
          <div>
            <span className="traininghub-eyebrow">TWOJA BIBLIOTEKA</span>
            <h2>Lista ćwiczeń</h2>
            <p>Wszystkie dodane pozycje w jednym miejscu.</p>
          </div>

          <div className="traininghub-summary-number">
            <strong>{exercises.length}</strong>
            <span>dodanych ćwiczeń</span>
          </div>
        </section>

        <section className="traininghub-panel exercises-library">
          <div className="traininghub-panel-heading">
            <span className="traininghub-panel-icon">＋</span>
            <div>
              <h2>Dodaj ćwiczenie</h2>
              <p>Wprowadź nazwę i podstawowe parametry.</p>
            </div>
          </div>

          <form className="traininghub-form exercise-form" onSubmit={addExercise}>
            <div className="exercise-form-main">
              <div>
                <label htmlFor="exercise-name">Nazwa ćwiczenia</label>
                <input
                  id="exercise-name"
                  type="text"
                  placeholder="Np. Pompki"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="exercise-category">Kategoria</label>
                <select
                  id="exercise-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="exercise-form-numbers">
              <div>
                <label htmlFor="exercise-sets">Serie</label>
                <input
                  id="exercise-sets"
                  type="number"
                  min="1"
                  step="1"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="exercise-reps">Powtórzenia</label>
                <input
                  id="exercise-reps"
                  type="number"
                  min="1"
                  step="1"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="traininghub-button" type="submit">
              Dodaj ćwiczenie <span>＋</span>
            </button>
          </form>
        </section>

        <section className="traininghub-exercise-results">
          <div className="traininghub-results-heading">
            <h2>Twoje ćwiczenia</h2>
            <span>{exercises.length} pozycji</span>
          </div>

          {exercises.length === 0 ? (
            <div className="traininghub-empty">
              <span>🏋️</span>
              <h3>Nie masz jeszcze ćwiczeń</h3>
              <p>Dodaj pierwszą pozycję do swojej biblioteki.</p>
            </div>
          ) : (
            <div className="traininghub-exercise-grid">
              {exercises.map((exercise) => (
                <article
                  className="traininghub-exercise-card"
                  key={exercise.id}
                >
                  <div className="traininghub-exercise-top">
                    <span className="traininghub-exercise-symbol">💪</span>

                    <button
                      className="traininghub-delete"
                      onClick={() => removeExercise(exercise.id)}
                      title="Usuń ćwiczenie"
                      aria-label={`Usuń ${exercise.name}`}
                    >
                      ×
                    </button>
                  </div>

                  <span className="traininghub-category">
                    {exercise.category}
                  </span>

                  <h3>{exercise.name}</h3>

                  <div className="traininghub-exercise-stats">
                    <div>
                      <strong>{exercise.sets}</strong>
                      <span>Serie</span>
                    </div>

                    <div>
                      <strong>{exercise.reps}</strong>
                      <span>Powtórzenia</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
