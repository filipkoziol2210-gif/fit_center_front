import { useEffect, useState } from "react";
import { apiJson, jsonBody } from "../api";

export default function TrainingPlanPage({ changePage }) {
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("");
  const [targetSets, setTargetSets] = useState("3");
  const [targetReps, setTargetReps] = useState("8");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [e, r] = await Promise.all([apiJson("/api/exercises/"), apiJson("/api/routines/")]);
      setExercises(e.exercises || []); setRoutines(r.routines || []);
    } catch (e) { setError(e.message || "Nie udało się pobrać rutyn."); }
  };
  useEffect(() => { load(); }, []);

  function addItem(e) {
    e.preventDefault();
    const x = exercises.find(a => String(a.id) === String(selected));
    if (!x) return setError("Wybierz ćwiczenie.");
    if (items.some(a => a.exercise_id === x.id)) return setError("To ćwiczenie jest już w rutynie.");
    setItems(old => [...old, { exercise_id: x.id, exercise_name: x.name, target_muscle: x.target_muscle, target_sets: Number(targetSets), target_reps: Number(targetReps) }]);
    setSelected(""); setError("");
  }

  async function save() {
    if (!name.trim()) return setError("Podaj nazwę rutyny.");
    if (!items.length) return setError("Dodaj co najmniej jedno ćwiczenie.");
    try {
      await apiJson("/api/routines/", { method: "POST", ...jsonBody({ name: name.trim(), exercises: items }) });
      setName(""); setItems(""); setItems([]); await load();
    } catch (e) { setError(e.message || "Nie udało się zapisać rutyny."); }
  }

  async function remove(id) {
    if (!window.confirm("Usunąć rutynę?")) return;
    try { await apiJson("/api/routines/?id=" + id, { method: "DELETE" }); setRoutines(r => r.filter(x => x.id !== id)); }
    catch (e) { setError(e.message || "Nie udało się usunąć rutyny."); }
  }

  return <main className="traininghub-subpage"><div className="traininghub-container">
    <button className="traininghub-back" onClick={() => changePage("training")}>← Trening</button>
    <div className="traininghub-heading"><div className="traininghub-heading-icon plan-icon">📋</div><div>
      <span className="traininghub-eyebrow">TWOJE SZABLONY</span><h1>Rutyny treningowe</h1><p>Twórz własne szablony z ćwiczeń dostępnych w centralnej bazie.</p>
    </div></div>
    {error && <p className="nutrition-error">{error}</p>}
    <section className="traininghub-workspace">
      <div className="traininghub-panel"><div className="traininghub-panel-heading"><span className="traininghub-panel-icon">＋</span><div><h2>Nowa rutyna</h2><p>Rutyna jest zapisywana w bazie i można jej użyć przy kolejnym treningu.</p></div></div>
        <div className="traininghub-form"><label>Nazwa rutyny</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Np. Push A" />
          <label>Ćwiczenie z bazy</label><select value={selected} onChange={e => setSelected(e.target.value)}><option value="">Wybierz ćwiczenie</option>{exercises.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><div><label>Serie</label><input type="number" min="1" value={targetSets} onChange={e => setTargetSets(e.target.value)} /></div><div><label>Powtórzenia</label><input type="number" min="1" value={targetReps} onChange={e => setTargetReps(e.target.value)} /></div></div>
          <button className="traininghub-button" type="button" onClick={addItem}>＋ Dodaj ćwiczenie</button>
        </div>
        {items.length > 0 && <div className="traininghub-history-list">{items.map((x, i) => <article className="traininghub-history-entry" key={x.exercise_id}><div className="traininghub-history-content"><strong>{i + 1}. {x.exercise_name}</strong><p>{x.target_muscle || "—"} · {x.target_sets} × {x.target_reps}</p></div><button className="traininghub-delete" onClick={() => setItems(old => old.filter(a => a.exercise_id !== x.exercise_id))}>×</button></article>)}</div>}
        <button className="traininghub-button" type="button" onClick={save}>Zapisz rutynę</button>
      </div>
      <div className="traininghub-panel"><div className="traininghub-panel-heading"><span className="traininghub-panel-icon">☷</span><div><h2>Zapisane rutyny</h2><p>Gotowe szablony do wielokrotnego użycia.</p></div><span className="traininghub-count">{routines.length}</span></div>
        {routines.length === 0 ? <div className="traininghub-empty"><h3>Brak rutyn</h3><p>Utwórz pierwszą.</p></div> : routines.map(r => <article className="traininghub-history-entry" key={r.id}><div className="traininghub-history-content"><strong>{r.name}</strong><p>{r.exercises.length} ćwiczeń</p>{r.exercises.map(x => <div key={x.exercise_id}>{x.exercise_name} · {x.target_sets} × {x.target_reps}</div>)}</div><div><button className="traininghub-button" onClick={() => changePage("training")}>Użyj</button><button className="traininghub-delete" onClick={() => remove(r.id)}>×</button></div></article>)}
      </div>
    </section>
  </div></main>;
}
