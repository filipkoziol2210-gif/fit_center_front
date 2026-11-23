import { useEffect, useMemo, useState } from "react";
import { apiJson, jsonBody } from "../api";

const formatDate = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pl-PL");
};

const shortDate = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
};

function LineChart({ data }) {
  if (!data.length) return <div className="progress-chart-empty">Dodaj co najmniej dwa pomiary, aby zobaczyć trend.</div>;

  const width = 760, height = 260;
  const pad = { left: 48, right: 20, top: 24, bottom: 42 };
  const values = data.map(item => Number(item.value)).filter(Number.isFinite);
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;

  const points = data.map((item, index) => {
    const x = pad.left + (index / Math.max(data.length - 1, 1)) * (width - pad.left - pad.right);
    const y = pad.top + (1 - (Number(item.value) - min) / range) * (height - pad.top - pad.bottom);
    return { ...item, x, y };
  });

  const path = points.map((point, index) => (index ? "L " : "M ") + point.x + " " + point.y).join(" ");

  return (
    <div className="progress-chart">
      <svg viewBox={"0 0 " + width + " " + height} role="img" aria-label="Wykres wagi">
        {[0, 0.5, 1].map(level => {
          const y = pad.top + level * (height - pad.top - pad.bottom);
          const label = (max - level * range).toFixed(1);
          return (
            <g key={level}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} className="progress-grid-line" />
              <text x={pad.left - 10} y={y + 4} textAnchor="end" className="progress-axis-label">{label}</text>
            </g>
          );
        })}
        <path d={path} className="progress-line" />
        {points.map(point => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="5" className="progress-point" />
            <text x={point.x} y={height - 15} textAnchor="middle" className="progress-axis-label">{shortDate(point.date)}</text>
          </g>
        ))}
      </svg>
      <div className="progress-chart-unit">kg</div>
    </div>
  );
}

function BarChart({ data }) {
  if (!data.length) return <div className="progress-chart-empty">Zapisz treningi z ciężarem, aby zobaczyć objętość.</div>;
  const max = Math.max(...data.map(item => Number(item.value)), 1);

  return (
    <div className="progress-bar-chart">
      {data.map(item => (
        <div className="progress-bar-item" key={item.date}>
          <div className="progress-bar-value">{Math.round(item.value)} kg</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ height: Math.max((item.value / max) * 100, 3) + "%" }} />
          </div>
          <span>{shortDate(item.date)}</span>
        </div>
      ))}
    </div>
  );
}

function ProgressPage({ changePage }) {
  const [measurements, setMeasurements] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [measurementDate, setMeasurementDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiJson("/api/body-measurements/"), apiJson("/api/workouts/"), apiJson("/api/profile/")])
      .then(([measurementData, workoutData, profileData]) => {
        setMeasurements(measurementData.measurements || []);
        setWorkouts(workoutData.workouts || []);
        setProfile(profileData.profile || null);
      })
      .catch(e => setError(e.message || "Nie udało się pobrać statystyk."))
      .finally(() => setLoading(false));
  }, []);

  const weightHistory = useMemo(
    () => [...measurements].filter(item => Number.isFinite(Number(item.weight_kg))).sort((a, b) => new Date(a.measurement_date) - new Date(b.measurement_date)),
    [measurements]
  );

  const latestWeight = weightHistory.length ? Number(weightHistory[weightHistory.length - 1].weight_kg) : null;
  const previousWeight = weightHistory.length > 1 ? Number(weightHistory[weightHistory.length - 2].weight_kg) : null;
  const weightDelta = latestWeight !== null && previousWeight !== null ? latestWeight - previousWeight : null;
  const heightCm = Number(profile?.height_cm);
  const bmi = latestWeight !== null && heightCm > 0 ? latestWeight / Math.pow(heightCm / 100, 2) : null;
  const totalSets = workouts.reduce((sum, workout) => sum + Number(workout.total_sets || 0), 0);
  const totalVolume = workouts.reduce((sum, workout) => sum + Number(workout.total_volume || 0), 0);

  const personalRecords = useMemo(() => {
    const records = {};
    workouts.forEach(workout => {
      (workout.sets || []).forEach(set => {
        if (set.weight == null) return;
        const key = set.exercise_id;
        const weightValue = Number(set.weight);
        if (!records[key] || weightValue > records[key].weight) {
          records[key] = { exercise_id: key, exercise_name: set.exercise_name, weight: weightValue, reps: Number(set.reps || 0), date: workout.start_time };
        }
      });
    });
    return Object.values(records).sort((a, b) => b.weight - a.weight).slice(0, 6);
  }, [workouts]);

  const recentVolume = useMemo(
    () => [...workouts].sort((a, b) => new Date(a.start_time) - new Date(b.start_time)).slice(-7).map(workout => ({ date: workout.start_time, value: Number(workout.total_volume || 0) })),
    [workouts]
  );

  async function saveMeasurement(event) {
    event.preventDefault();
    if (!weight) {
      setError("Podaj wagę.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result = await apiJson("/api/body-measurements/", {
        method: "POST",
        ...jsonBody({
          measurement_date: measurementDate,
          weight_kg: Number(weight),
          body_fat_percentage: bodyFat === "" ? null : Number(bodyFat),
          notes: notes.trim()
        })
      });

      setMeasurements(current => [{
        id: result.id,
        measurement_date: measurementDate,
        weight_kg: Number(weight),
        body_fat_percentage: bodyFat === "" ? null : Number(bodyFat),
        notes: notes.trim()
      }, ...current]);

      setWeight("");
      setBodyFat("");
      setNotes("");
    } catch (e) {
      setError(e.message || "Nie udało się zapisać pomiaru.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="progress-page"><div className="progress-loading">Ładowanie statystyk...</div></main>;

  return (
    <main className="progress-page">
      <button className="page-back" onClick={() => changePage("home")}>← Strona główna</button>

      <div className="progress-heading">
        <div className="subpage-icon">📊</div>
        <div>
          <span className="progress-eyebrow">FIT CENTER / ANALITYKA</span>
          <h1>Statystyki</h1>
          <p>Twoje treningi, wyniki i pomiary zebrane w jednym miejscu.</p>
        </div>
      </div>

      {error && <p className="nutrition-error" role="alert">{error}</p>}

      <section className="progress-kpis">
        <div className="progress-kpi"><span>Treningi</span><strong>{workouts.length}</strong><small>zapisanych sesji</small></div>
        <div className="progress-kpi"><span>Serie</span><strong>{totalSets}</strong><small>wykonanych serii</small></div>
        <div className="progress-kpi"><span>Objętość</span><strong>{Math.round(totalVolume)} kg</strong><small>łączny ciężar × powtórzenia</small></div>
        <div className="progress-kpi"><span>Aktualna waga</span><strong>{latestWeight === null ? "—" : latestWeight.toFixed(1) + " kg"}</strong><small>{weightDelta === null ? "brak poprzedniego pomiaru" : (weightDelta > 0 ? "+" : "") + weightDelta.toFixed(1) + " kg od poprzedniego"}</small></div>
        <div className="progress-kpi progress-kpi-bmi"><span>BMI</span><strong>{bmi === null ? "—" : bmi.toFixed(1)}</strong><small>{bmi === null ? "uzupełnij wzrost w profilu" : "na podstawie aktualnej wagi"}</small></div>
      </section>

      <div className="progress-layout">
        <section className="progress-panel progress-wide">
          <div className="progress-panel-heading">
            <div><span className="progress-section-label">POMIARY</span><h2>Trend wagi</h2><p>Historia pomiarów zapisana na Twoim koncie.</p></div>
            {latestWeight !== null && <strong className="progress-highlight">{latestWeight.toFixed(1)} kg</strong>}
          </div>
          <LineChart data={weightHistory.map(item => ({ date: item.measurement_date, value: Number(item.weight_kg) }))} />
        </section>

        <section className="progress-panel">
          <div className="progress-panel-heading"><div><span className="progress-section-label">NOWY POMIAR</span><h2>Zapisz wynik</h2><p>Wpis trafia bezpośrednio do bazy.</p></div></div>
          <form className="progress-measure-form" onSubmit={saveMeasurement}>
            <label>Data<input type="date" value={measurementDate} onChange={e => setMeasurementDate(e.target.value)} required /></label>
            <label>Waga (kg)<input type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="np. 82.4" required /></label>
            <label>BF (%)<input type="number" min="0" max="100" step="0.1" value={bodyFat} onChange={e => setBodyFat(e.target.value)} placeholder="opcjonalnie" /></label>
            <label>Notatka<textarea rows="2" value={notes} onChange={e => setNotes(e.target.value)} placeholder="np. pomiar rano" /></label>
            <button className="progress-save-button" type="submit" disabled={saving}>{saving ? "Zapisywanie..." : "Zapisz pomiar"}</button>
          </form>
        </section>

        <section className="progress-panel progress-wide">
          <div className="progress-panel-heading"><div><span className="progress-section-label">TRENING</span><h2>Objętość ostatnich sesji</h2><p>Łączny ciężar × powtórzenia dla każdej zapisanej sesji.</p></div></div>
          <BarChart data={recentVolume} />
        </section>

        <section className="progress-panel">
          <div className="progress-panel-heading"><div><span className="progress-section-label">REKORDY</span><h2>Najlepsze wyniki</h2><p>Najcięższa zapisana seria dla każdego ćwiczenia.</p></div></div>
          {personalRecords.length ? (
            <div className="progress-record-list">
              {personalRecords.map(record => (
                <div className="progress-record" key={record.exercise_id}>
                  <div><strong>{record.exercise_name}</strong><span>{formatDate(record.date)}</span></div>
                  <b>{record.weight} kg × {record.reps}</b>
                </div>
              ))}
            </div>
          ) : <div className="progress-empty">Brak zapisanych rekordów z ciężarem.</div>}
        </section>
      </div>

      <section className="progress-panel progress-history">
        <div className="progress-panel-heading"><div><span className="progress-section-label">HISTORIA</span><h2>Ostatnie pomiary</h2><p>Wszystkie wpisy pobierane są z bazy danych.</p></div><span className="progress-count">{measurements.length}</span></div>
        {measurements.length ? (
          <div className="progress-measurements">
            {measurements.slice(0, 8).map(item => (
              <div className="progress-measurement-row" key={item.id}>
                <span>{formatDate(item.measurement_date)}</span>
                <strong>{Number(item.weight_kg).toFixed(1)} kg</strong>
                <span>{item.body_fat_percentage == null ? "BF —" : "BF " + Number(item.body_fat_percentage).toFixed(1) + "%"}</span>
                <span>{item.notes || "—"}</span>
              </div>
            ))}
          </div>
        ) : <div className="progress-empty">Nie zapisano jeszcze żadnych pomiarów.</div>}
      </section>
    </main>
  );
}

export default ProgressPage;