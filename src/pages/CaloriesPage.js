import { useEffect, useState } from "react";
import { apiJson, jsonBody } from "../api";

export default function CaloriesPage({ changePage }) {
  const [product, setProduct] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [fat, setFat] = useState("0");
  const [weight, setWeight] = useState("100");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError("");
      try {
        const data = await apiJson("/api/calories/");
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Nie udało się pobrać produktów.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadItems();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalCalories = items.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);

  async function addProduct(event) {
    event.preventDefault();
    const trimmedProduct = product.trim();
    const calorieValue = Number(calories);

    if (!trimmedProduct || calories === "" || !Number.isFinite(calorieValue) || calorieValue < 0) {
      setError("Podaj nazwę produktu i poprawną, nieujemną wartość kcal na 100 g.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const data = await apiJson("/api/calories/", {
        method: "POST",
        ...jsonBody({ name: trimmedProduct, calories: calorieValue, protein: Number(protein), carbs: Number(carbs), fat: Number(fat), weight_grams: Number(weight) }),
      });

      if (!data.success || data.id == null) {
        throw new Error(data.error || "Serwer nie potwierdził zapisu produktu.");
      }

      setItems((previous) => [
        ...previous,
        { id: data.id, name: trimmedProduct, calories: Number(data.calories ?? calorieValue), protein: Number(data.protein ?? 0), carbs: Number(data.carbs ?? 0), fat: Number(data.fat ?? 0), weight_grams: Number(data.weight_grams ?? 100) },
      ]);
      setProduct("");
      setCalories("");
      setProtein("0");
      setCarbs("0");
      setFat("0");
      setWeight("100");
    } catch (err) {
      setError(err.message || "Nie udało się dodać produktu.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(id) {
    setError("");
    try {
      await apiJson(`/api/calories/?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setItems((previous) => previous.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || "Nie udało się usunąć produktu.");
    }
  }

  return (
    <main className="nutrition-page">
      <div className="nutrition-container">
        <button className="nutrition-back-link" onClick={() => changePage("diet")}>
          ← Powrót do diety
        </button>

        <header className="nutrition-heading">
          <div className="nutrition-heading-icon calories-icon">🔥</div>
          <div>
            <h1>Bilans kalorii</h1>
            <p>Dodawaj produkty i sprawdzaj ich wartość energetyczną.</p>
          </div>
        </header>

        <section className="calories-summary">
          <div>
            <span className="nutrition-eyebrow">PODSUMOWANIE</span>
            <h2>Łączna wartość energetyczna</h2>
            <p>Suma kalorii zapisanych produktów.</p>
          </div>
          <div className="calories-summary-value">
            <strong>{Math.round(totalCalories).toLocaleString("pl-PL")}</strong>
            <span>kcal</span>
          </div>
        </section>

        {error && <p className="nutrition-error" role="alert">{error}</p>}

        <section className="calories-layout">
          <div className="nutrition-panel calories-form-panel">
            <div className="nutrition-panel-heading">
              <span className="panel-icon">＋</span>
              <div>
                <h2>Dodaj produkt</h2>
                <p>Wartość energetyczna podawana na 100 g produktu.</p>
              </div>
            </div>

            <form className="nutrition-form" onSubmit={addProduct}>
              <label htmlFor="product-name">Nazwa produktu</label>
              <input
                id="product-name"
                type="text"
                placeholder="Np. Owsianka"
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                maxLength={200}
                required
              />

              <label htmlFor="product-calories">Kalorie na 100 g</label>
              <div className="nutrition-input-with-unit">
                <input
                  id="product-calories"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Np. 250"
                  value={calories}
                  onChange={(event) => setCalories(event.target.value)}
                  required
                />
                <span>kcal</span>
              </div>

              <label htmlFor="product-protein">Białko na 100 g</label>
              <input id="product-protein" type="number" min="0" step="0.1" value={protein} onChange={(event) => setProtein(event.target.value)} required />

              <label htmlFor="product-carbs">Węglowodany na 100 g</label>
              <input id="product-carbs" type="number" min="0" step="0.1" value={carbs} onChange={(event) => setCarbs(event.target.value)} required />

              <label htmlFor="product-fat">Tłuszcze na 100 g</label>
              <input id="product-fat" type="number" min="0" step="0.1" value={fat} onChange={(event) => setFat(event.target.value)} required />

              <label htmlFor="product-weight">Spożyta ilość</label>
              <div className="nutrition-input-with-unit">
                <input id="product-weight" type="number" min="1" step="1" value={weight} onChange={(event) => setWeight(event.target.value)} required />
                <span>g</span>
              </div>

              <button className="nutrition-primary-button" type="submit" disabled={saving}>
                {saving ? "Dodawanie..." : <>Dodaj do listy <span>＋</span></>}
              </button>
            </form>
          </div>

          <div className="nutrition-panel calories-list-panel">
            <div className="nutrition-panel-heading">
              <span className="panel-icon">☷</span>
              <div>
                <h2>Dodane produkty</h2>
                <p>Produkty zapisane w dzienniku.</p>
              </div>
              <span className="nutrition-count">{items.length}</span>
            </div>

            {loading ? (
              <p role="status">Ładowanie produktów...</p>
            ) : items.length === 0 ? (
              <div className="nutrition-empty-state">
                <span>🍎</span>
                <h3>Lista jest jeszcze pusta</h3>
                <p>Dodaj pierwszy produkt za pomocą formularza.</p>
              </div>
            ) : (
              <div className="calories-product-list">
                {items.map((item) => (
                  <div className="calories-product-item" key={item.id}>
                    <div className="product-avatar">🍽️</div>
                    <div className="product-details">
                      <strong>{item.name}</strong>
                      <span>{item.weight_grams || 100} g · B: {Math.round(Number(item.protein) || 0)} g · W: {Math.round(Number(item.carbs) || 0)} g · T: {Math.round(Number(item.fat) || 0)} g</span>
                    </div>
                    <strong className="product-calories">
                      {Math.round(Number(item.calories) || 0)} kcal
                    </strong>
                    <button
                      className="nutrition-delete-button"
                      type="button"
                      onClick={() => removeProduct(item.id)}
                      aria-label={`Usuń ${item.name}`}
                      title="Usuń produkt"
                    >
                      ×
                    </button>
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
