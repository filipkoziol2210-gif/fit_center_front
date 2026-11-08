import { useEffect, useMemo, useState } from "react";
import { apiJson, jsonBody } from "../api";

const categories = [
  { name: "Śniadanie", value: "breakfast", icon: "🌅" },
  { name: "Obiad", value: "lunch", icon: "🍲" },
  { name: "Kolacja", value: "dinner", icon: "🌙" },
  { name: "Przekąski", value: "snack", icon: "🍎" },
];

const blankProduct = { name: "", brand: "", calories_100g: "", protein_100g: "0", carbs_100g: "0", fats_100g: "0" };

export default function MealsPage({ changePage }) {
  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);
  const [type, setType] = useState("breakfast");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [foodId, setFoodId] = useState("");
  const [grams, setGrams] = useState("100");
  const [basket, setBasket] = useState([]);
  const [product, setProduct] = useState(blankProduct);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [foodData, mealData] = await Promise.all([
        apiJson("/api/foods/"),
        apiJson("/api/meals/"),
      ]);
      setFoods(Array.isArray(foodData.foods) ? foodData.foods : []);
      setMeals(Array.isArray(mealData.meals) ? mealData.meals : []);
    } catch (err) {
      setError(err.message || "Nie udało się pobrać danych dziennika.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const basketTotals = useMemo(() => basket.reduce((sum, item) => ({
    calories: sum.calories + item.calories_100g * item.weight_grams / 100,
    protein: sum.protein + item.protein_100g * item.weight_grams / 100,
    carbs: sum.carbs + item.carbs_100g * item.weight_grams / 100,
    fat: sum.fat + item.fats_100g * item.weight_grams / 100,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }), [basket]);

  function addToBasket(event) {
    event.preventDefault();
    const food = foods.find((item) => String(item.id) === String(foodId));
    const weight = Number(grams);
    if (!food || !Number.isInteger(weight) || weight <= 0) {
      setError("Wybierz produkt i podaj dodatnią gramaturę całkowitą.");
      return;
    }
    setBasket((old) => [...old, { ...food, weight_grams: weight, key: crypto.randomUUID() }]);
    setGrams("100");
    setError("");
  }

  async function createFood(event) {
    event.preventDefault();
    try {
      const payload = {
        ...product,
        calories_100g: Number(product.calories_100g),
        protein_100g: Number(product.protein_100g),
        carbs_100g: Number(product.carbs_100g),
        fats_100g: Number(product.fats_100g),
      };
      const data = await apiJson("/api/foods/", { method: "POST", ...jsonBody(payload) });
      if (!data.success) throw new Error(data.error || "Nie udało się dodać produktu.");
      const created = { id: data.id, ...payload };
      setFoods((old) => [...old, created].sort((a, b) => a.name.localeCompare(b.name, "pl")));
      setFoodId(String(data.id));
      setProduct(blankProduct);
      setShowProductForm(false);
    } catch (err) { setError(err.message); }
  }

  async function saveMeal(event) {
    event.preventDefault();
    if (!basket.length) { setError("Dodaj co najmniej jeden produkt do posiłku."); return; }
    setSaving(true);
    setError("");
    try {
      const data = await apiJson("/api/meals/", {
        method: "POST",
        ...jsonBody({ type, date, foods: basket.map((item) => ({ food_id: item.id, weight_grams: item.weight_grams })) }),
      });
      if (!data.success) throw new Error(data.error || "Nie udało się zapisać posiłku.");
      setBasket([]);
      await load();
    } catch (err) { setError(err.message || "Nie udało się zapisać posiłku."); }
    finally { setSaving(false); }
  }

  async function removeMeal(id) {
    try {
      await apiJson(`/api/meals/?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setMeals((old) => old.filter((meal) => meal.id !== id));
    } catch (err) { setError(err.message || "Nie udało się usunąć posiłku."); }
  }

  return (
    <main className="nutrition-page"><div className="nutrition-container">
      <button className="nutrition-back-link" onClick={() => changePage("diet")}>← Powrót do diety</button>
      <header className="nutrition-heading"><div className="nutrition-heading-icon meals-icon">🍽️</div><div><h1>Dziennik posiłków</h1><p>Jeden posiłek może zawierać wiele produktów. Wartości liczą się automatycznie.</p></div></header>
      {error && <p className="nutrition-error" role="alert">{error}</p>}
      <section className="meals-layout">
        <div className="nutrition-panel meals-form-panel">
          <div className="nutrition-panel-heading"><span className="panel-icon">＋</span><div><h2>Składniki posiłku</h2><p>Dodaj produkty i ustaw ich gramaturę.</p></div></div>
          <form className="nutrition-form" onSubmit={addToBasket}>
            <label htmlFor="meal-date">Data</label><input id="meal-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <label htmlFor="meal-type">Kategoria</label><select id="meal-type" value={type} onChange={(e) => setType(e.target.value)}>{categories.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}</select>
            <label htmlFor="food-select">Produkt</label><select id="food-select" value={foodId} onChange={(e) => setFoodId(e.target.value)} required><option value="">Wybierz produkt</option>{foods.map(f => <option key={f.id} value={f.id}>{f.name}{f.brand ? ` — ${f.brand}` : ""}</option>)}</select>
            <label htmlFor="food-grams">Ilość</label><div className="nutrition-input-with-unit"><input id="food-grams" type="number" min="1" step="1" value={grams} onChange={(e) => setGrams(e.target.value)} required /><span>g</span></div>
            <button className="nutrition-primary-button" type="submit">Dodaj produkt do posiłku ＋</button>
          </form>
          <button type="button" className="nutrition-secondary-button" onClick={() => setShowProductForm(v => !v)}>{showProductForm ? "Anuluj dodawanie produktu" : "＋ Utwórz nowy produkt"}</button>
          {showProductForm && <form className="nutrition-form" onSubmit={createFood}>
            <h3>Nowy produkt — wartości na 100 g</h3>
            <label>Nazwa</label><input value={product.name} onChange={e => setProduct({...product, name:e.target.value})} required />
            <label>Marka (opcjonalnie)</label><input value={product.brand} onChange={e => setProduct({...product, brand:e.target.value})} />
            {["calories_100g","protein_100g","carbs_100g","fats_100g"].map((field) => <div key={field}><label>{({calories_100g:"Kalorie",protein_100g:"Białko",carbs_100g:"Węglowodany",fats_100g:"Tłuszcze"})[field]}</label><input type="number" min="0" step="0.1" value={product[field]} onChange={e => setProduct({...product,[field]:e.target.value})} required /></div>)}
            <button className="nutrition-primary-button" type="submit">Zapisz produkt w katalogu</button>
          </form>}
          {basket.length > 0 && <div className="meal-category-panel"><h3>Składniki ({basket.length})</h3>{basket.map(item => <div className="meal-entry" key={item.key}><span>{item.name} — {item.weight_grams} g</span><button type="button" className="nutrition-delete-button" onClick={() => setBasket(old => old.filter(x => x.key !== item.key))}>×</button></div>)}<p><b>{Math.round(basketTotals.calories)} kcal</b> · B {basketTotals.protein.toFixed(1)} g · W {basketTotals.carbs.toFixed(1)} g · T {basketTotals.fat.toFixed(1)} g</p><button className="nutrition-primary-button" disabled={saving} onClick={saveMeal}>{saving ? "Zapisywanie..." : "Zapisz cały posiłek"}</button></div>}
        </div>
        <div className="meals-board">
          {loading ? <p>Ładowanie...</p> : categories.map(category => {
            const list = meals.filter(m => m.meal_type === category.value);
            return <section className="meal-category-panel" key={category.value}><div className="meal-category-heading"><div className="meal-category-title"><span>{category.icon}</span><h2>{category.name}</h2></div><span className="nutrition-count">{list.length}</span></div>
              {list.length === 0 ? <p className="meal-category-empty">Brak posiłków</p> : list.map(meal => <article className="meal-entry" key={meal.id}><div className="meal-entry-content"><strong>{meal.date} · {meal.name || category.name}</strong><ul>{meal.foods.map(food => <li key={food.entry_id}>{food.name} — {food.weight_grams} g ({Math.round(food.calories)} kcal)</li>)}</ul><p><b>{Math.round(meal.totals.calories)} kcal</b> · B {meal.totals.protein.toFixed(1)} g · W {meal.totals.carbs.toFixed(1)} g · T {meal.totals.fat.toFixed(1)} g</p></div><button className="nutrition-delete-button" type="button" onClick={() => removeMeal(meal.id)} aria-label="Usuń posiłek">×</button></article>)}
            </section>;
          })}
        </div>
      </section>
    </div></main>
  );
}
