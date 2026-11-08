import { useState } from "react";

function CaloriesPage({ changePage }) {

  const [product, setProduct] = useState("");
  const [calories, setCalories] = useState("");

  const [items, setItems] = useState([]);

  const total = items.reduce(
    (sum, item) => sum + item.calories,
    0
  );

  function addProduct(e) {
    e.preventDefault();

    if (!product.trim() || Number(calories) <= 0) {
      return;
    }

    setItems([
      ...items,
      {
        id: Date.now(),
        name: product,
        calories: Number(calories)
      }
    ]);

    setProduct("");
    setCalories("");
  }

  function removeProduct(id) {
    setItems(items.filter(item => item.id !== id));
  }

  return (
    <main className="food-subpage calories-page">

      <button
        className="page-back"
        onClick={() => changePage("diet")}
      >
        ← Powrót do diety
      </button>

      <div className="calories-header">
        <div>
          <span className="diet-eyebrow">DZIENNY DZIENNIK</span>
          <h1>Bilans kalorii</h1>
          <p>Dodawaj produkty i kontroluj ich wartość energetyczną.</p>
        </div>

        <div className="calories-flame">🔥</div>
      </div>

      <div className="calories-total-card">

        <div>
          <span className="small-label">Łączna wartość dodanych produktów</span>
          <div className="calories-total">
            {total} <span>kcal</span>
          </div>
        </div>

        <div className="calories-total-icon">⚡</div>

      </div>

      <div className="calories-content">

        <section className="food-panel">

          <h2>Dodaj produkt</h2>
          <p className="food-muted">
            Uzupełnij nazwę i wartość energetyczną.
          </p>

          <form onSubmit={addProduct}>

            <div className="input-group">
              <label>Nazwa produktu</label>
              <input
                type="text"
                placeholder="Np. Owsianka"
                value={product}
                onChange={e => setProduct(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Kalorie (kcal)</label>
              <input
                type="number"
                min="1"
                placeholder="Np. 350"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                required
              />
            </div>

            <button className="login-submit" type="submit">
              + Dodaj produkt
            </button>

          </form>

        </section>

        <section className="food-panel">

          <div className="food-list-heading">
            <h2>Dodane produkty</h2>
            <span>{items.length} produktów</span>
          </div>

          {items.length === 0 ? (

            <div className="food-empty">
              <span>🍎</span>
              <h3>Lista jest pusta</h3>
              <p>Dodaj pierwszy produkt, aby zobaczyć bilans.</p>
            </div>

          ) : (

            <div className="food-list">

              {items.map(item => (

                <div className="food-list-item" key={item.id}>

                  <div className="food-list-icon">🥗</div>

                  <div className="food-list-name">
                    <strong>{item.name}</strong>
                    <span>{item.calories} kcal</span>
                  </div>

                  <button
                    className="delete-food"
                    onClick={() => removeProduct(item.id)}
                    type="button"
                  >
                    ×
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default CaloriesPage;
