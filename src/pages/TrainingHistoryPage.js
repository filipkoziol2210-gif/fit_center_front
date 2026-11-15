import { useEffect, useState } from "react";
import { apiJson } from "../api";

const date = v => { const d = new Date(v); return Number.isNaN(d.getTime()) ? v : d.toLocaleString("pl-PL"); };

export default function TrainingHistoryPage({ embedded = false }) {
  const [workouts, setWorkouts] = useState([]);
  const [open, setOpen] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { apiJson("/api/workouts/").then(d => setWorkouts(d.workouts || [])).catch(e => setError(e.message || "Nie udało się pobrać historii.")); }, []);

  async function remove(id) {
    if (!window.confirm("Usunąć zapisany trening?")) return;
    try { await apiJson("/api/workouts/?id=" + id, { method: "DELETE" }); setWorkouts(w => w.filter(x => x.id !== id)); }
    catch (e) { setError(e.message || "Nie udało się usunąć treningu."); }
  }

  const sets = workouts.reduce((n, w) => n + Number(w.total_sets || 0), 0);
  const volume = workouts.reduce((n, w) => n + Number(w.total_volume || 0), 0);

  return <section className="traininghub-history-view">
    <div className="traininghub-heading"><div className="traininghub-heading-icon history-icon">🕒</div><div>
      <span className="traininghub-eyebrow">TWOJE SESJE</span><h1>Historia treningów</h1><p>Gotowe sesje są odczytywane z bazy razem z każdą zapisaną serią.</p>
    </div></div>
    {error && <p className="nutrition-error">{error}</p>}
    <section className="traininghub-history-stats">
      <div className="traininghub-stat-card"><span className="traininghub-stat-icon">📋</span><div><span>Treningi</span><strong>{workouts.length}</strong></div></div>
      <div className="traininghub-stat-card"><span className="traininghub-stat-icon">💪</span><div><span>Serie</span><strong>{sets}</strong></div></div>
      <div className="traininghub-stat-card"><span className="traininghub-stat-icon">📊</span><div><span>Objętość</span><strong>{Math.round(volume)} kg</strong></div></div>
    </section>
    <section className="traininghub-panel" style={{ marginTop: 20 }}><div className="traininghub-panel-heading">
      <span className="traininghub-panel-icon">☷</span><div><h2>Zapisane treningi</h2><p>Otwórz sesję, aby zobaczyć ćwiczenia i serie.</p></div><span className="traininghub-count">{workouts.length}</span>
    </div>
    {workouts.length === 0 ? <div className="traininghub-empty"><h3>Brak zapisanych treningów</h3><p>Nie ma jeszcze żadnej sesji na koncie.</p></div> :
      <div className="traininghub-history-list">{workouts.map(w => <article className="traininghub-history-entry" key={w.id}>
        <div className="traininghub-history-content"><strong>{w.name}</strong><p>{date(w.start_time)} → {date(w.end_time)}</p><span className="traininghub-duration">{w.exercises?.length || 0} ćwiczeń · {w.total_sets} serii · {Math.round(Number(w.total_volume || 0))} kg</span>{w.notes && <p>{w.notes}</p>}</div>
        <div style={{ display: "flex", gap: 8 }}><button className="traininghub-button" type="button" onClick={() => setOpen(open === w.id ? null : w.id)}>{open === w.id ? "Zwiń" : "Szczegóły"}</button><button className="traininghub-delete" type="button" onClick={() => remove(w.id)}>×</button></div>
        {open === w.id && <div style={{ width: "100%", marginTop: 16 }}>{w.exercises?.map(ex => <div className="traininghub-panel" style={{ marginBottom: 10 }} key={ex.exercise_id}>
          <strong>{ex.exercise_name}</strong><p>{ex.target_muscle || ""}</p><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><th>SET</th><th>CIĘŻAR</th><th>POWT.</th><th>RPE</th></tr></thead><tbody>
          {ex.sets.map(s => <tr key={s.id}><td>{s.set_order}</td><td>{s.weight == null ? "—" : s.weight + " kg"}</td><td>{s.reps}</td><td>{s.rpe == null ? "—" : s.rpe}</td></tr>)}
          </tbody></table></div>)}</div>}
      </article>)}</div>}
    </section>
  </section>;
}
