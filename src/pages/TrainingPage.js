import { useEffect, useState } from "react";
import { apiJson, jsonBody } from "../api";
import TrainingHistoryPage from "./TrainingHistoryPage";

const localNow = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function TrainingPage({ changePage }) {
  const [exercises, setExercises] = useState([]);
  const [name, setName] = useState("Trening");
  const [start, setStart] = useState(localNow());
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    apiJson("/api/exercises/")
      .then(e => { setExercises(e.exercises || []); })
      .catch(e => setError(e.message || "Nie udało się pobrać danych treningowych."));
  }, []);

  const addExercise = (id, sets = 1, reps = 10) => {
    const e = exercises.find(x => String(x.id) === String(id));
    if (!e || items.some(x => x.exercise_id === e.id)) return;
    setItems(old => [...old, {
      exercise_id: e.id, exercise_name: e.name, target_muscle: e.target_muscle,
      sets: Array.from({ length: sets }, (_, i) => ({ id: Date.now() + i, reps: String(reps), weight: "", rpe: "" }))
    }]);
  };

  const updateSet = (eid, index, field, value) => setItems(old => old.map(e => e.exercise_id !== eid ? e : ({
    ...e, sets: e.sets.map((s, i) => i === index ? { ...s, [field]: value } : s)
  })));

  const addSet = eid => setItems(old => old.map(e => {
    if (e.exercise_id !== eid) return e;
    const p = e.sets[e.sets.length - 1] || {};
    return { ...e, sets: [...e.sets, { id: Date.now(), reps: p.reps || "10", weight: p.weight || "", rpe: p.rpe || "" }] };
  }));

  const removeSet = (eid, index) => setItems(old => old.map(e => {
    if (e.exercise_id !== eid || e.sets.length === 1) return e;
    return { ...e, sets: e.sets.filter((_, i) => i !== index) };
  }));

  async function save(e) {
    e.preventDefault();
    const sets = items.flatMap(ex => ex.sets.map((s, i) => ({
      exercise_id: ex.exercise_id, set_order: i + 1, reps: Number(s.reps),
      weight: s.weight === "" ? null : Number(s.weight),
      rpe: s.rpe === "" ? null : Number(s.rpe)
    })));
    if (!name.trim()) return setError("Podaj nazwę treningu.");
    if (!sets.length) return setError("Dodaj ćwiczenie i serię.");
    if (sets.some(s => !Number.isFinite(s.reps) || s.reps < 1)) return setError("Powtórzenia muszą być dodatnie.");
    setSaving(true); setError("");
    try {
      await apiJson("/api/workouts/", { method: "POST", ...jsonBody({
        name: name.trim(), start_time: start, end_time: localNow(), notes: notes.trim(), sets
      })});
      setActiveTab("history");
    } catch (err) { setError(err.message || "Nie udało się zapisać treningu."); }
    finally { setSaving(false); }
  }

  return <main className="traininghub-subpage"><div className="traininghub-container">
    <button className="traininghub-back" onClick={() => changePage("home")}>← Strona główna</button>
    <div className="traininghub-heading"><div className="traininghub-heading-icon">🏋️</div><div>
      <span className="traininghub-eyebrow">FIT CENTER / TRENING</span><h1>Zapisz trening</h1>
      <p>Loguj serię po serii, wybierając ćwiczenia wyłącznie z bazy danych.</p>
    </div></div>
    {error && <p className="nutrition-error" role="alert">{error}</p>}

    <nav className="traininghub-navigation" aria-label="Sekcje treningu">
      <button type="button" className="traininghub-nav-link active" onClick={() => setActiveTab("new")}>Trening</button>
      <button type="button" className="traininghub-nav-link" onClick={() => changePage("exercises")}>Ćwiczenia</button>
    </nav>
    <div className="traininghub-tabs" role="tablist" aria-label="Widok treningu">
      <button type="button" role="tab" aria-selected={activeTab === "new"} className={activeTab === "new" ? "active" : ""} onClick={() => setActiveTab("new")}>＋ Nowy trening</button>
      <button type="button" role="tab" aria-selected={activeTab === "history"} className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>◷ Historia treningów</button>
    </div>
    {activeTab === "history" ? <TrainingHistoryPage embedded /> : (
    <form onSubmit={save}>
      <section className="traininghub-summary plan-summary"><div>
        <span className="traininghub-eyebrow">NOWA SESJA</span><h2>{name}</h2>
        <p>{items.length} ćwiczeń · {items.reduce((n, e) => n + e.sets.length, 0)} serii</p>
      </div><div className="traininghub-summary-actions">
        <button className="traininghub-button" type="submit" disabled={saving}>{saving ? "Zapisywanie..." : "Zakończ i zapisz"}</button>
      </div></section>

      <section className="traininghub-panel" style={{ marginBottom: 20 }}><div className="traininghub-panel-heading">
        <span className="traininghub-panel-icon">＋</span><div><h2>Sesja</h2><p>Ustaw nazwę, datę i notatkę dla tej sesji.</p></div>
      </div><div className="traininghub-form">
        <label>Nazwa treningu</label><input value={name} onChange={e => setName(e.target.value)} />
        <label>Rozpoczęcie</label><input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
        <label>Notatka</label><textarea rows="2" value={notes} onChange={e => setNotes(e.target.value)} />
      </div></section>

      <section className="traininghub-panel" style={{ marginBottom: 20 }}><div className="traininghub-panel-heading">
        <span className="traininghub-panel-icon">＋</span><div><h2>Dodaj ćwiczenie</h2><p>Lista pochodzi bezpośrednio z tabeli exercises.</p></div>
      </div><select value="" onChange={e => e.target.value && addExercise(e.target.value)}>
        <option value="">Wybierz ćwiczenie</option>{exercises.map(x => <option key={x.id} value={x.id}>{x.name} · {x.target_muscle || "—"}</option>)}
      </select></section>

      <section className="traininghub-workspace">{items.length ? items.map(ex => <div className="traininghub-panel" key={ex.exercise_id}>
        <div className="traininghub-panel-heading"><span className="traininghub-panel-icon">💪</span><div><h2>{ex.exercise_name}</h2><p>{ex.target_muscle || "—"}</p></div></div>
        <div className="traininghub-sets-table-wrap"><table className="traininghub-sets-table"><thead><tr>
          <th>SET</th><th>CIĘŻAR KG</th><th>POWT.</th><th>RPE</th><th></th>
        </tr></thead><tbody>{ex.sets.map((s, i) => <tr key={s.id}>
          <td>{i + 1}</td>
          <td><input type="number" min="0" step="0.5" value={s.weight} onChange={e => updateSet(ex.exercise_id, i, "weight", e.target.value)} /></td>
          <td><input type="number" min="1" value={s.reps} onChange={e => updateSet(ex.exercise_id, i, "reps", e.target.value)} /></td>
          <td><input type="number" min="0" max="10" step="0.5" value={s.rpe} onChange={e => updateSet(ex.exercise_id, i, "rpe", e.target.value)} /></td>
          <td><button type="button" className="traininghub-delete" onClick={() => removeSet(ex.exercise_id, i)}>×</button></td>
        </tr>)}</tbody></table></div>
        <button type="button" className="traininghub-button secondary" onClick={() => addSet(ex.exercise_id)} style={{ marginTop: 12 }}>＋ Dodaj serię</button>
      </div>) : <div className="traininghub-panel traininghub-empty"><h3>Trening jest pusty</h3><p>Dodaj pierwsze ćwiczenie z katalogu.</p></div>}</section>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}><button className="traininghub-button" type="submit" disabled={saving}>{saving ? "Zapisywanie..." : "Zakończ trening i zapisz"}</button></div>
    </form>
    )}
  </div></main>;
}
