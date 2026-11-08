import { useState } from "react";

export default function MacrosPage({ changePage }) {
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");

  const proteinCalories = (Number(protein) || 0) * 4;
  const fatCalories = (Number(fat) || 0) * 9;
  const carbsCalories = (Number(carbs) || 0) * 4;

  const totalCalories =
    proteinCalories + fatCalories + carbsCalories;

  const macros = [
    {
      name: "Białko",
      grams: Number(protein) || 0,
      calories: proteinCalories,
      color: "protein",
    },
    {
      name: "Tłuszcze",
      grams: Number(fat) || 0,
      calories: fatCalories,
      color: "fat",
    },
    {
      name: "Węglowodany",
      grams: Number(carbs) || 0,
      calories: carbsCalories,
      color: "carbs",
    },
  ];

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
          <div className="nutrition-heading-icon macros-icon">⚖️</div>

          <div>
            <h1>Makroskładniki</h1>
            <p>Sprawdzaj ilość białka, tłuszczów i węglowodanów.</p>
          </div>
        </header>

        <section className="macros-overview">
          <div>
            <span className="nutrition-eyebrow">ANALIZA SKŁADNIKÓW</span>
            <h2>Podsumowanie wartości</h2>
            <p>Wprowadź ilości makroskładników, aby zobaczyć zestawienie.</p>
          </div>

          <div className="macros-total">
            <strong>{totalCalories.toLocaleString("pl-PL")}</strong>
            <span>kcal łącznie</span>
          </div>
        </section>

        <section className="macros-layout">
          <div className="nutrition-panel macros-form-panel">
            <div className="nutrition-panel-heading">
              <span className="panel-icon">✎</span>
              <div>
                <h2>Wartości makro</h2>
                <p>Podaj ilości w gramach.</p>
              </div>
            </div>

            <div className="macro-input-group">
              <label htmlFor="macro-protein">
                <span className="macro-dot protein-dot" />
                Białko
              </label>
              <div className="nutrition-input-with-unit">
                <input
                  id="macro-protein"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
                <span>g</span>
              </div>
            </div>

            <div className="macro-input-group">
              <label htmlFor="macro-fat">
                <span className="macro-dot fat-dot" />
                Tłuszcze
              </label>
              <div className="nutrition-input-with-unit">
                <input
                  id="macro-fat"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
                <span>g</span>
              </div>
            </div>

            <div className="macro-input-group">
              <label htmlFor="macro-carbs">
                <span className="macro-dot carbs-dot" />
                Węglowodany
              </label>
              <div className="nutrition-input-with-unit">
                <input
                  id="macro-carbs"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
                <span>g</span>
              </div>
            </div>

            <button
              className="nutrition-secondary-button"
              onClick={() => {
                setProtein("");
                setFat("");
                setCarbs("");
              }}
            >
              Wyczyść dane
            </button>
          </div>

          <div className="nutrition-panel macros-chart-panel">
            <div className="nutrition-panel-heading">
              <span className="panel-icon">▥</span>
              <div>
                <h2>Rozkład makroskładników</h2>
                <p>Udział energii pochodzącej z poszczególnych składników.</p>
              </div>
            </div>

            <div className="macro-total-display">
              <strong>{totalCalories.toLocaleString("pl-PL")}</strong>
              <span>kcal</span>
            </div>

            <div className="macro-bars">
              {macros.map((macro) => {
                const percentage =
                  totalCalories > 0
                    ? (macro.calories / totalCalories) * 100
                    : 0;

                return (
                  <div className="macro-bar-item" key={macro.name}>
                    <div className="macro-bar-top">
                      <div className="macro-bar-name">
                        <span className={`macro-dot ${macro.color}-dot`} />
                        <strong>{macro.name}</strong>
                      </div>

                      <span>
                        {macro.grams} g · {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="macro-track">
                      <div
                        className={`macro-fill ${macro.color}-fill`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="macro-calories">
                      {macro.calories.toLocaleString("pl-PL")} kcal
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="macro-footnote">
              Wartości energetyczne są szacowane na podstawie przelicznika:
              białko 4 kcal/g, tłuszcze 9 kcal/g, węglowodany 4 kcal/g.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
