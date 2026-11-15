
import { useEffect, useMemo, useState } from "react";
import { apiJson } from "../api";

const DAYS = [
  { key: "monday", label: "Poniedziałek" },
  { key: "tuesday", label: "Wtorek" },
  { key: "wednesday", label: "Środa" },
  { key: "thursday", label: "Czwartek" },
  { key: "friday", label: "Piątek" },
  { key: "saturday", label: "Sobota" },
  { key: "sunday", label: "Niedziela" },
];
const STORAGE_KEY = "fit-center-training-plan";

function loadPlan() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

export default function TrainingPlanPage({ changePage }) {
  const [plans, setPlans] = useState(loadPlan);
  const [exercises, setExercises] = useState([]);
  const [day, setDay] = useState("monday");
  const [exerciseId, setExerciseId] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [error, setError] = useState("");

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(plans)); }, [plans]);

  useEffect(() => {
    apiJson("/api/exercises/")
      .then((data) => setExercises(Array.isArray(data.exercises) ? data.exercises : []))
      .catch((err) => setError(err.message || "Nie udało się pobrać ćwiczeń."));
  }, []);

  const selectedExercise = exercises.find((item) => String(item.id) === String(exerciseId));
  const grouped = useMemo(
    () => DAYS.map((item) => ({ ...item, entries: plans.filter((plan) => plan.day === item.key) })),
    [plans]
  );

  function addPlan(event) {
    event.preventDefault();
    const numericSets = Number(sets);
    const numericReps = Number(reps);
    if (!selectedExercise || numericSets < 1 || numericReps < 1) {
      setError("Wybierz ćwiczenie oraz poprawną liczbę serii i powtórzeń.");
      return;
    }
    setPlans((previous) => [
      ...previous,
      {
        id: Date.now() + "-" + Math.random(),
        day,
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
        targetMuscle: selectedExercise.target_muscle || "",
        equipment: selectedExercise.equipment_type || "",
        sets: numericSets,
        reps: numericReps,
      },
    ]);
    setError("");
  }

  return (
    <main className="traininghub-subpage">
      <div className="traininghub-container">
        <button className="traininghub-back" onClick={() => changePage("training")}>← Powrót do treningu</button>
        <div className="traininghub-heading">
          <div className="traininghub-heading-icon plan-icon">📋</div>
          <div>
            <span className="traininghub-eyebrow">TWÓJ HARMONOGRAM</span>
            <h1>Plan treningowy</h1>
            <p>Plan jest zapisywany lokalnie i zachowuje się po odświeżeniu strony.</p>
          </div>
        </div>
        {error && <p className="nutrition-error" role="alert">{error}</p>}

        <section className="traininghub-summary plan-summary">
          <div>
            <span className="traininghub-eyebrow">AKTUALNY PLAN</span>
            <h2>Ćwiczenia na cały tydzień</h2>
            <p>Wybierz ćwiczenie z katalogu backendu i przypisz je do dnia.</p>
          </div>
          <div className="traininghub-summary-number">
            <strong>{plans.length}</strong><span>zaplanowanych pozycji</span>
          </div>
        </section>

        <section className="traininghub-workspace">
          <div className="traininghub-panel plan-form-panel">
            <div className="traininghub-panel-heading">
              <span className="traininghub-panel-icon">＋</span>
              <div><h2>Dodaj ćwiczenie do planu</h2><p>Plan korzysta z tej samej bazy ćwiczeń co rejestracja serii.</p></div>
            </div>
            <form className="traininghub-form" onSubmit={addPlan}>
              <label htmlFor="plan-day">Dzień tygodnia</label>
              <select id="plan-day" value={day} onChange={(e) => setDay(e.target.value)}>
                {DAYS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
              <label htmlFor="plan-exercise">Ćwiczenie</label>
              <select id="plan-exercise" value={exerciseId} onChange={(e) => setExerciseId(e.target.value)} required>
                <option value="">Wybierz ćwiczenie</option>
                {exercises.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <label htmlFor="plan-sets">Serie</label>
              <input id="plan-sets" type="number" min="1" step="1" value={sets} onChange={(e) => setSets(e.target.value)} required />
              <label htmlFor="plan-reps">Powtórzenia</label>
              <input id="plan-reps" type="number" min="1" step="1" value={reps} onChange={(e) => setReps(e.target.value)} required />
              <button className="traininghub-button" type="submit">Dodaj do planu <span>＋</span></button>
            </form>
          </div>

          <div className="traininghub-panel plan-list-panel">
            <div className="traininghub-panel-heading">
              <span className="traininghub-panel-icon">☷</span>
              <div><h2>Rozkład tygodnia</h2><p>Pozycje są uporządkowane według dnia.</p></div>
              <span className="traininghub-count">{plans.length}</span>
            </div>
            {plans.length === 0 ? (
              <div className="traininghub-empty"><span>📅</span><h3>Plan jest jeszcze pusty</h3><p>Dodaj pierwsze ćwiczenie za pomocą formularza.</p></div>
            ) : (
              <div className="traininghub-plan-list">
                {grouped.map((group) => group.entries.length > 0 && (
                  <div className="traininghub-day-group" key={group.key}>
                    <h3>{group.label}</h3>
                    {group.entries.map((item) => (
                      <article className="traininghub-plan-entry" key={item.id}>
                        <div className="traininghub-entry-content">
                          <strong>{item.exerciseName}</strong>
                          <p>{item.sets} serie × {item.reps} powtórzeń{item.targetMuscle ? " · " + item.targetMuscle : ""}</p>
                        </div>
                        <button className="traininghub-delete" onClick={() => setPlans((old) => old.filter((x) => x.id !== item.id))} type="button" aria-label="Usuń z planu">×</button>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
