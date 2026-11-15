
import { useEffect, useMemo, useState } from "react";
import { apiJson, jsonBody } from "../api";

const emptyForm = { name: "", start_time: "", end_time: "", calories_burned: "", notes: "" };

export default function TrainingHistoryPage({ changePage }) {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [sets, setSets] = useState([]);
  const [setForm, setSetForm] = useState({ exercise_id: "", reps: "10", weight: "", rpe: "", set_order: "1" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [setSaving, setSetSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiJson("/api/workouts/").then((data) => setWorkouts(Array.isArray(data.workouts) ? data.workouts : [])),
      apiJson("/api/exercises/").then((data) => setExercises(Array.isArray(data.exercises) ? data.exercises : [])),
    ])
      .catch((err) => setError(err.message || "Nie udało się pobrać historii treningów."))
      .finally(() => setLoading(false));
  }, []);

  async function selectWorkout(workout) {
    setSelectedWorkout(workout);
    setError("");
    try {
      const data = await apiJson("/api/workout-sets/?workout_id=" + encodeURIComponent(workout.id));
      setSets(Array.isArray(data.workout_sets) ? data.workout_sets : []);
    } catch (err) { setError(err.message || "Nie udało się pobrać serii."); }
  }

  async function addWorkout(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.start_time || !form.end_time) {
      setError("Nazwa, początek i koniec treningu są wymagane."); return;
    }
    setSaving(true); setError("");
    try {
      const calories = form.calories_burned === "" ? null : Number(form.calories_burned);
      const data = await apiJson("/api/workouts/", {
        method: "POST",
        ...jsonBody({ name: form.name.trim(), start_time: form.start_time, end_time: form.end_time, calories_burned: calories, notes: form.notes.trim() }),
      });
      setWorkouts((old) => [{
        id: data.workout_id, name: form.name.trim(), start_time: form.start_time, end_time: form.end_time,
        calories_burned: calories, notes: form.notes.trim(),
      }, ...old]);
      setForm(emptyForm);
    } catch (err) { setError(err.message || "Nie udało się zapisać treningu."); }
    finally { setSaving(false); }
  }

  async function addSet(event) {
    event.preventDefault();
    if (!selectedWorkout || !setForm.exercise_id || Number(setForm.reps) < 0 || Number(setForm.set_order) < 1) {
      setError("Wybierz ćwiczenie i poprawne parametry serii."); return;
    }
    setSetSaving(true); setError("");
    try {
      const weight = setForm.weight === "" ? null : Number(setForm.weight);
      const rpe = setForm.rpe === "" ? null : Number(setForm.rpe);
      const data = await apiJson("/api/workout-sets/", {
        method: "POST",
        ...jsonBody({
          workout_id: selectedWorkout.id, exercise_id: Number(setForm.exercise_id),
          set_order: Number(setForm.set_order), reps: Number(setForm.reps), weight, rpe,
        }),
      });
      const exercise = exercises.find((item) => item.id === Number(setForm.exercise_id));
      setSets((old) => [...old, {
        id: data.id, workout_id: selectedWorkout.id, exercise_id: Number(setForm.exercise_id),
        set_order: Number(setForm.set_order), reps: Number(setForm.reps), weight, rpe,
        exercise_name: exercise ? exercise.name : "Ćwiczenie",
      }]);
      setSetForm((old) => ({ ...old, set_order: String(Number(old.set_order) + 1) }));
    } catch (err) { setError(err.message || "Nie udało się zapisać serii."); }
    finally { setSetSaving(false); }
  }

  async function removeWorkout(id) {
    if (!window.confirm("Usunąć cały trening wraz z zapisanymi seriami?")) return;
    try {
      await apiJson("/api/workouts/?id=" + encodeURIComponent(id), { method: "DELETE" });
      setWorkouts((old) => old.filter((item) => item.id !== id));
      if (selectedWorkout && selectedWorkout.id === id) { setSelectedWorkout(null); setSets([]); }
    } catch (err) { setError(err.message || "Nie udało się usunąć treningu."); }
  }

  const totalMinutes = useMemo(() => workouts.reduce((sum, item) => {
    const start = new Date(item.start_time), end = new Date(item.end_time);
    const minutes = (end - start) / 60000;
    return sum + (Number.isFinite(minutes) && minutes > 0 ? minutes : 0);
  }, 0), [workouts]);

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("pl-PL");
  }

  return (
    <main className="traininghub-subpage">
      <div className="traininghub-container">
        <button className="traininghub-back" onClick={() => changePage("training")}>← Powrót do treningu</button>
        <div className="traininghub-heading">
          <div className="traininghub-heading-icon history-icon">🕒</div>
          <div><span className="traininghub-eyebrow">TWOJA AKTYWNOŚĆ</span><h1>Historia treningów</h1><p>Treningi i serie są zapisywane na koncie użytkownika.</p></div>
        </div>
        {error && <p className="nutrition-error" role="alert">{error}</p>}
        <section className="traininghub-history-stats">
          <div className="traininghub-stat-card"><span className="traininghub-stat-icon">📋</span><div><span>Liczba treningów</span><strong>{workouts.length}</strong></div></div>
          <div className="traininghub-stat-card"><span className="traininghub-stat-icon">⏱️</span><div><span>Łączny czas</span><strong>{Math.floor(totalMinutes / 60)} h {Math.round(totalMinutes % 60)} min</strong></div></div>
        </section>

        <section className="traininghub-workspace history-workspace">
          <div className="traininghub-panel history-form-panel">
            <div className="traininghub-panel-heading"><span className="traininghub-panel-icon">＋</span><div><h2>Zapisz trening</h2><p>Dodaj wykonaną sesję.</p></div></div>
            <form className="traininghub-form" onSubmit={addWorkout}>
              <label>Nazwa treningu</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Np. Push A" required />
              <label>Rozpoczęcie</label><input type="datetime-local" value={form.start_time} onChange={(e) => setForm({...form, start_time: e.target.value})} required />
              <label>Zakończenie</label><input type="datetime-local" value={form.end_time} onChange={(e) => setForm({...form, end_time: e.target.value})} required />
              <label>Spalone kalorie (opcjonalnie)</label><input type="number" min="0" step="1" value={form.calories_burned} onChange={(e) => setForm({...form, calories_burned: e.target.value})} />
              <label>Notatka</label><textarea rows="3" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
              <button className="traininghub-button" type="submit" disabled={saving}>{saving ? "Zapisywanie..." : "Zapisz trening ＋"}</button>
            </form>
          </div>

          <div className="traininghub-panel history-list-panel">
            <div className="traininghub-panel-heading"><span className="traininghub-panel-icon">☷</span><div><h2>Ostatnie treningi</h2><p>Wybierz trening, aby dodać serie.</p></div><span className="traininghub-count">{workouts.length}</span></div>
            {loading ? <p>Ładowanie...</p> : workouts.length === 0 ? (
              <div className="traininghub-empty"><h3>Brak zapisanych treningów</h3><p>Dodaj pierwszą sesję.</p></div>
            ) : (
              <div className="traininghub-history-list">
                {workouts.map((workout) => (
                  <article className="traininghub-history-entry" key={workout.id}>
                    <div className="traininghub-history-content">
                      <strong>{workout.name}</strong><p>{formatDate(workout.start_time)} → {formatDate(workout.end_time)}</p>
                      {workout.notes && <p>{workout.notes}</p>}
                      {workout.calories_burned != null && <span className="traininghub-duration">{Math.round(Number(workout.calories_burned))} kcal</span>}
                    </div>
                    <div>
                      <button className="traininghub-button" type="button" onClick={() => selectWorkout(workout)}>Serie</button>
                      <button className="traininghub-delete" type="button" onClick={() => removeWorkout(workout.id)} aria-label="Usuń trening">×</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {selectedWorkout && (
          <section className="traininghub-workspace">
            <div className="traininghub-panel">
              <div className="traininghub-panel-heading"><span className="traininghub-panel-icon">＋</span><div><h2>Serie: {selectedWorkout.name}</h2><p>Każda seria trafia do workout_sets.</p></div></div>
              <form className="traininghub-form" onSubmit={addSet}>
                <label>Ćwiczenie</label>
                <select value={setForm.exercise_id} onChange={(e) => setSetForm({...setForm, exercise_id: e.target.value})} required>
                  <option value="">Wybierz ćwiczenie</option>
                  {exercises.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <label>Numer serii</label><input type="number" min="1" step="1" value={setForm.set_order} onChange={(e) => setSetForm({...setForm, set_order: e.target.value})} required />
                <label>Powtórzenia</label><input type="number" min="0" step="1" value={setForm.reps} onChange={(e) => setSetForm({...setForm, reps: e.target.value})} required />
                <label>Ciężar (kg, opcjonalnie)</label><input type="number" min="0" step="0.5" value={setForm.weight} onChange={(e) => setSetForm({...setForm, weight: e.target.value})} />
                <label>RPE 0–10 (opcjonalnie)</label><input type="number" min="0" max="10" step="0.5" value={setForm.rpe} onChange={(e) => setSetForm({...setForm, rpe: e.target.value})} />
                <button className="traininghub-button" type="submit" disabled={setSaving}>{setSaving ? "Zapisywanie..." : "Zapisz serię ＋"}</button>
              </form>
            </div>
            <div className="traininghub-panel">
              <div className="traininghub-panel-heading"><span className="traininghub-panel-icon">☷</span><div><h2>Zapisane serie</h2><p>{sets.length} serii</p></div></div>
              {sets.length === 0 ? <div className="traininghub-empty"><h3>Brak serii</h3><p>Dodaj pierwszą serię.</p></div> : (
                <div className="traininghub-history-list">
                  {sets.map((item) => (
                    <article className="traininghub-history-entry" key={item.id}>
                      <div className="traininghub-history-content">
                        <strong>{item.exercise_name || (exercises.find((e) => e.id === item.exercise_id) || {}).name || "Ćwiczenie"}</strong>
                        <p>Seria {item.set_order}: {item.reps} powt. {item.weight != null ? "· " + item.weight + " kg" : ""} {item.rpe != null ? "· RPE " + item.rpe : ""}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
