import { useEffect, useState } from "react";
import { apiJson } from "../api";

export default function CaloriesPage({ changePage }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiJson("/api/calories/").then(data => {
      if (!active) return;
      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(Number(data.totalCalories) || 0);
    }).catch(err => active && setError(err.message || "Nie udało się pobrać bilansu."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  async function removeEntry(id) {
    try {
      await apiJson(`/api/calories/?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setItems(old => old.filter(item => item.id !== id));
      setTotal(old => Math.max(0, old - (Number(items.find(item => item.id === id)?.calories) || 0)));
    } catch (err) { setError(err.message || "Nie udało się usunąć produktu."); }
  }

  return <main className="nutrition-page"><div className="nutrition-container">
    <button className="nutrition-back-link" onClick={() => changePage("diet")}>← Powrót do diety</button>
    <header className="nutrition-heading"><div className="nutrition-heading-icon calories-icon">🔥</div><div><h1>Bilans kalorii</h1><p>Wartości pochodzą z produktów zapisanych w dzienniku posiłków.</p></div></header>
    {error && <p className="nutrition-error" role="alert">{error}</p>}
    <section className="calories-summary"><div><span className="nutrition-eyebrow">DZISIAJ</span><h2>Spożyta energia</h2><p>Suma wszystkich produktów z dzisiejszych posiłków.</p></div><div className="calories-summary-value"><strong>{Math.round(total).toLocaleString("pl-PL")}</strong><span>kcal</span></div></section>
    <section className="nutrition-panel calories-list-panel"><div className="nutrition-panel-heading"><span className="panel-icon">☷</span><div><h2>Spożyte produkty</h2><p>Dodawanie produktów odbywa się w Dzienniku posiłków.</p></div><span className="nutrition-count">{items.length}</span></div>
      {loading ? <p>Ładowanie...</p> : items.length === 0 ? <p className="meal-category-empty">Brak wpisów na dzisiaj. Dodaj posiłek w dzienniku.</p> : <div className="calories-product-list">{items.map(item => <div className="calories-product-item" key={item.id}><div className="product-avatar">🍽️</div><div className="product-details"><strong>{item.name}</strong><span>{item.weight_grams} g · B {Number(item.protein).toFixed(1)} g · W {Number(item.carbs).toFixed(1)} g · T {Number(item.fat).toFixed(1)} g</span></div><strong className="product-calories">{Math.round(item.calories)} kcal</strong><button className="nutrition-delete-button" type="button" onClick={() => removeEntry(item.id)} aria-label={`Usuń ${item.name}`}>×</button></div>)}</div>}
    </section>
  </div></main>;
}
