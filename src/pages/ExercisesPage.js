
import { useEffect, useMemo, useState } from "react";
import { apiJson } from "../api";

export default function ExercisesPage({ changePage }) {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiJson("/api/exercises/")
      .then((data) => { if (active) setExercises(Array.isArray(data.exercises) ? data.exercises : []); })
      .catch((err) => active && setError(err.message || "Nie udało się pobrać ćwiczeń."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const muscles = useMemo(
    () => [...new Set(exercises.map((item) => item.target_muscle).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pl")),
    [exercises]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exercises.filter((item) => {
      const text = [item.name, item.target_muscle, item.equipment_type].filter(Boolean).join(" ").toLowerCase();
      return (!q || text.includes(q)) && (muscle === "all" || item.target_muscle === muscle);
    });
  }, [exercises, search, muscle]);

  return (
    <main className="traininghub-subpage">
      <div className="traininghub-container">
        <button className="traininghub-back" onClick={() => changePage("training")}>← Powrót do treningu</button>
        <div className="traininghub-heading">
          <div className="traininghub-heading-icon exercises-icon">💪</div>
          <div><span className="traininghub-eyebrow">BAZA AKTYWNOŚCI</span><h1>Ćwiczenia</h1><p>Biblioteka pobierana bezpośrednio z backendu.</p></div>
        </div>
        {error && <p className="nutrition-error" role="alert">{error}</p>}
        <section className="traininghub-summary exercises-summary">
          <div><span className="traininghub-eyebrow">BIBLIOTEKA</span><h2>Ćwiczenia dostępne w systemie</h2><p>Te identyfikatory są używane również przy zapisie serii treningowych.</p></div>
          <div className="traininghub-summary-number"><strong>{filtered.length}</strong><span>pasujących ćwiczeń</span></div>
        </section>
        <section className="traininghub-panel exercises-library">
          <div className="traininghub-form exercise-form">
            <div className="exercise-form-main">
              <div><label htmlFor="exercise-search">Szukaj</label><input id="exercise-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Np. wyciskanie" /></div>
              <div><label htmlFor="exercise-muscle">Partia mięśniowa</label><select id="exercise-muscle" value={muscle} onChange={(e) => setMuscle(e.target.value)}><option value="all">Wszystkie</option>{muscles.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            </div>
          </div>
        </section>
        {loading ? <div className="traininghub-empty"><h3>Ładowanie ćwiczeń...</h3></div> :
          filtered.length === 0 ? <div className="traininghub-empty"><h3>Brak pasujących ćwiczeń</h3></div> :
          <section className="traininghub-exercise-grid">
            {filtered.map((exercise) => (
              <article className="traininghub-exercise-card" key={exercise.id}>
                <div className="traininghub-exercise-top"><span className="traininghub-exercise-symbol">💪</span></div>
                <span className="traininghub-category">{exercise.target_muscle || "Bez kategorii"}</span>
                <h3>{exercise.name}</h3>
                <div className="traininghub-exercise-stats">
                  <div><strong>{exercise.equipment_type || "—"}</strong><span>Sprzęt</span></div>
                  <div><strong>#{exercise.id}</strong><span>ID</span></div>
                </div>
              </article>
            ))}
          </section>}
      </div>
    </main>
  );
}
