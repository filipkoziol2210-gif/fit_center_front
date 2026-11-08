import { useState } from "react";

export default function CaloriesPage({ changePage }) {
  const [product, setProduct] = useState("");
  const [calories, setCalories] = useState("");
  const [items, setItems] = useState([]);

  const totalCalories = items.reduce(
    (sum, item) => sum + item.calories,
    0
  );

  function addProduct(e) {
    e.preventDefault();

    if (!product.trim() || calories === "" || Number(calories) < 0) {
      return;
    }

    setItems([
      ...items,
      {
        id: Date.now(),
        name: product.trim(),
        calories: Number(calories),
      },
    ]);

    setProduct("");
    setCalories("");
  }

  function removeProduct(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <main className="nutrition-page">
      <div className="nutrition-container">
        <button
          className="nutrition-back-link"
          onClick={() => changePage("diet")}
        >
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
            <p>Wynik na podstawie produktów dodanych do listy.</p>
          </div>

          <div className="calories-summary-value">
            <strong>{totalCalories.toLocaleString("pl-PL")}</strong>
            <span>kcal</span>
          </div>
        </section>

        <section className="calories-layout">
          <div className="nutrition-panel calories-form-panel">
            <div className="nutrition-panel-heading">
              <span className="panel-icon">＋</span>
              <div>
                <h2>Dodaj produkt</h2>
                <p>Uzupełnij informacje o produkcie.</p>
              </div>
            </div>

            <form className="nutrition-form" onSubmit={addProduct}>
              <label htmlFor="product-name">Nazwa produktu</label>
              <input
                id="product-name"
                type="text"
                placeholder="Np. Owsianka"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              />

              <label htmlFor="product-calories">Wartość energetyczna</label>
              <div className="nutrition-input-with-unit">
                <input
                  id="product-calories"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Np. 250"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                />
                <span>kcal</span>
              </div>

              <button className="nutrition-primary-button" type="submit">
                Dodaj do listy <span>＋</span>
              </button>
            </form>
          </div>

          <div className="nutrition-panel calories-list-panel">
            <div className="nutrition-panel-heading">
              <span className="panel-icon">☷</span>
              <div>
                <h2>Dodane produkty</h2>
                <p>Lista produktów w bieżącym zestawieniu.</p>
              </div>
              <span className="nutrition-count">{items.length}</span>
            </div>

            {items.length === 0 ? (
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
                      <span>Produkt spożywczy</span>
                    </div>

                    <strong className="product-calories">
                      {item.calories} kcal
                    </strong>

                    <button
                      className="nutrition-delete-button"
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
