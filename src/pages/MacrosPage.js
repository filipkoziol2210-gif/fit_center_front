import { useEffect, useMemo, useState } from "react";
import { apiJson, jsonBody } from "../api";

export default function MacrosPage({ changePage }) {
  const [protein, setProtein] = useState("0");
  const [fat, setFat] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [consumed, setConsumed] = useState({ protein: 0, fat: 0, carbs: 0, calories: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMacros() {
      setLoading(true);
      setError("");
      try {
        const data = await apiJson("/api/macros/");
        if (!cancelled) {
          setProtein(String(data.protein ?? 0));
          setFat(String(data.fat ?? 0));
          setCarbs(String(data.carbs ?? 0));
          setConsumed({ protein: Number(data.consumedProtein) || 0, fat: Number(data.consumedFat) || 0, carbs: Number(data.consumedCarbs) || 0, calories: Number(data.consumedCalories) || 0 });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Nie udało się pobrać celów makro.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMacros();
    return () => {
      cancelled = true;
    };
  }, []);

  const numericValues = useMemo(() => ({
    protein: Number(protein),
    fat: Number(fat),
    carbs: Number(carbs),
  }), [protein, fat, carbs]);

  const proteinCalories = (Number.isFinite(numericValues.protein) ? numericValues.protein : 0) * 4;
  const fatCalories = (Number.isFinite(numericValues.fat) ? numericValues.fat : 0) * 9;
  const carbsCalories = (Number.isFinite(numericValues.carbs) ? numericValues.carbs : 0) * 4;
  const totalCalories = proteinCalories + fatCalories + carbsCalories;

  const macros = [
    { name: "Białko", grams: numericValues.protein || 0, calories: proteinCalories, color: "protein" },
    { name: "Tłuszcze", grams: numericValues.fat || 0, calories: fatCalories, color: "fat" },
    { name: "Węglowodany", grams: numericValues.carbs || 0, calories: carbsCalories, color: "carbs" },
  ];

  async function saveMacros(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const values = [numericValues.protein, numericValues.fat, numericValues.carbs];
    if (values.some((value) => !Number.isFinite(value) || value < 0)) {
      setError("Wszystkie wartości muszą być poprawnymi liczbami nieujemnymi.");
      return;
    }

    setSaving(true);
    try {
      const data = await apiJson("/api/macros/", {
        method: "POST",
        ...jsonBody({
          protein: numericValues.protein,
          fat: numericValues.fat,
          carbs: numericValues.carbs,
        }),
      });

      if (!data.success) throw new Error(data.error || "Serwer nie potwierdził zapisu.");
      setMessage("Cele makroskładników zostały zapisane.");
    } catch (err) {
      setError(err.message || "Nie udało się zapisać celów makro.");
    } finally {
      setSaving(false);
    }
  }

  function clearForm() {
    setProtein("0");
    setFat("0");
    setCarbs("0");
    setMessage("");
    setError("");
  }

  return (
    <main className="nutrition-page">
      <div className="nutrition-container">
        <button className="nutrition-back-link" onClick={() => changePage("diet")}>
          ← Powrót do diety
        </button>

        <header className="nutrition-heading">
          <div className="nutrition-heading-icon macros-icon">⚖️</div>
          <div>
            <h1>Cele makroskładników</h1>
            <p>Ustaw dzienne cele białka, tłuszczów i węglowodanów.</p>
          </div>
        </header>

        <section className="macros-overview">
          <div>
            <span className="nutrition-eyebrow">ANALIZA CELÓW</span>
            <h2>Energia wynikająca z makro</h2>
            <p>Wartość jest obliczana na podstawie podanych celów w gramach.</p>
          </div>
          <div className="macros-total">
            <strong>{Math.round(totalCalories).toLocaleString("pl-PL")}</strong>
            <span>kcal łącznie</span>
          </div>
        </section>

        {error && <p className="nutrition-error" role="alert">{error}</p>}
        {message && <p className="nutrition-success" role="status">{message}</p>}

        <section className="macros-overview">
          <div>
            <span className="nutrition-eyebrow">DZISIEJSZE SPOŻYCIE</span>
            <h2>{Math.round(consumed.calories).toLocaleString("pl-PL")} kcal</h2>
            <p>Białko: {consumed.protein.toFixed(1)} g · Tłuszcze: {consumed.fat.toFixed(1)} g · Węglowodany: {consumed.carbs.toFixed(1)} g</p>
          </div>
        </section>

        <section className="macros-layout">
          <form className="nutrition-panel macros-form-panel" onSubmit={saveMacros}>
            <div className="nutrition-panel-heading">
              <span className="panel-icon">✎</span>
              <div>
                <h2>Dzienne cele makro</h2>
                <p>Podaj docelowe ilości w gramach.</p>
              </div>
            </div>

            {[
              { id: "macro-protein", label: "Białko", value: protein, setter: setProtein, dot: "protein-dot" },
              { id: "macro-fat", label: "Tłuszcze", value: fat, setter: setFat, dot: "fat-dot" },
              { id: "macro-carbs", label: "Węglowodany", value: carbs, setter: setCarbs, dot: "carbs-dot" },
            ].map((item) => (
              <div className="macro-input-group" key={item.id}>
                <label htmlFor={item.id}>
                  <span className={`macro-dot ${item.dot}`} />{item.label}
                </label>
                <div className="nutrition-input-with-unit">
                  <input
                    id={item.id}
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={item.value}
                    onChange={(event) => item.setter(event.target.value)}
                    disabled={loading}
                  />
                  <span>g</span>
                </div>
              </div>
            ))}

            <button className="nutrition-primary-button" type="submit" disabled={saving || loading}>
              {saving ? "Zapisywanie..." : "Zapisz cele"}
            </button>
            <button
              type="button"
              className="nutrition-secondary-button"
              onClick={clearForm}
              disabled={saving || loading}
            >
              Wyczyść formularz
            </button>
          </form>

          <div className="nutrition-panel macros-chart-panel">
            <div className="nutrition-panel-heading">
              <span className="panel-icon">▥</span>
              <div>
                <h2>Rozkład energii</h2>
                <p>Udział energii wynikającej z każdego makroskładnika.</p>
              </div>
            </div>

            <div className="macro-total-display">
              <strong>{Math.round(totalCalories).toLocaleString("pl-PL")}</strong>
              <span>kcal</span>
            </div>

            <div className="macro-bars">
              {macros.map((macro) => {
                const percentage = totalCalories > 0 ? (macro.calories / totalCalories) * 100 : 0;
                return (
                  <div className="macro-bar-item" key={macro.name}>
                    <div className="macro-bar-top">
                      <div className="macro-bar-name">
                        <span className={`macro-dot ${macro.color}-dot`} />
                        <strong>{macro.name}</strong>
                      </div>
                      <span>
                        {(Number.isFinite(macro.grams) ? macro.grams : 0).toLocaleString("pl-PL")} g · {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="macro-track">
                      <div
                        className={`macro-fill ${macro.color}-fill`}
                        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                      />
                    </div>
                    <span className="macro-calories">{Math.round(macro.calories).toLocaleString("pl-PL")} kcal</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
