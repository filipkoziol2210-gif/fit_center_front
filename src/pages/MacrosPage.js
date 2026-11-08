import { useState } from "react";

function MacrosPage({ changePage }) {

  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");

  const p = Math.max(0, Number(protein) || 0);
  const f = Math.max(0, Number(fat) || 0);
  const c = Math.max(0, Number(carbs) || 0);

  const total = p * 4 + f * 9 + c * 4;

  const sum = p + f + c;

  const proteinPercent = sum ? (p / sum) * 100 : 0;
  const fatPercent = sum ? (f / sum) * 100 : 0;
  const carbsPercent = sum ? (c / sum) * 100 : 0;

  return (
    <main className="food-subpage macros-page">

      <button
        className="page-back"
        onClick={() => changePage("diet")}
      >
        ← Powrót do diety
      </button>

      <div className="macros-header">
        <div>
          <span className="diet-eyebrow">ANALIZA SKŁADNIKÓW</span>
          <h1>Makroskładniki</h1>
          <p>
            Sprawdź ilość białka, tłuszczów i węglowodanów.
          </p>
        </div>

        <div className="macros-header-icon">🧬</div>
      </div>

      <div className="macros-total-card">

        <span>Energia obliczona z makroskładników</span>

        <strong>{total.toFixed(0)} <small>kcal</small></strong>

        <p>
          Białko i węglowodany: 4 kcal/g · Tłuszcze: 9 kcal/g
        </p>

      </div>

      <div className="macros-layout">

        <section className="macros-input-panel">

          <h2>Wprowadź wartości</h2>

          <div className="macro-input protein-input">
            <label>Białko (g)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={protein}
              onChange={e => setProtein(e.target.value)}
            />
          </div>

          <div className="macro-input fat-input">
            <label>Tłuszcze (g)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={fat}
              onChange={e => setFat(e.target.value)}
            />
          </div>

          <div className="macro-input carbs-input">
            <label>Węglowodany (g)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={carbs}
              onChange={e => setCarbs(e.target.value)}
            />
          </div>

        </section>

        <section className="macros-visual-panel">

          <h2>Podsumowanie</h2>

          <div className="macro-visual-total">
            <strong>{sum.toFixed(0)} g</strong>
            <span>Łączna masa makroskładników</span>
          </div>

          <div className="macro-bars">

            <div className="macro-bar-row">
              <div className="macro-bar-label">
                <span>Białko</span>
                <strong>{p} g</strong>
              </div>
              <div className="macro-track">
                <div
                  className="macro-fill protein-fill"
                  style={{ width: `${proteinPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="macro-bar-row">
              <div className="macro-bar-label">
                <span>Tłuszcze</span>
                <strong>{f} g</strong>
              </div>
              <div className="macro-track">
                <div
                  className="macro-fill fat-fill"
                  style={{ width: `${fatPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="macro-bar-row">
              <div className="macro-bar-label">
                <span>Węglowodany</span>
                <strong>{c} g</strong>
              </div>
              <div className="macro-track">
                <div
                  className="macro-fill carbs-fill"
                  style={{ width: `${carbsPercent}%` }}
                ></div>
              </div>
            </div>

          </div>

          <p className="macro-info">
            Wartości procentowe przedstawiają udział poszczególnych
            makroskładników w łącznej masie wpisanych składników.
          </p>

        </section>

      </div>

    </main>
  );
}

export default MacrosPage;
