
import { useState } from "react";

function BMIPage({ changePage }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);

  function calculateBMI(e) {
    e.preventDefault();

    const h = Number(height) / 100;
    const w = Number(weight);

    if (h <= 0 || w <= 0) {
      return;
    }

    const result = w / (h * h);

    setBmi(result);
  }

  function getCategory() {
    if (bmi === null) return "";

    if (bmi < 18.5) return "Poniżej zakresu referencyjnego";
    if (bmi < 25) return "W zakresie referencyjnym";
    if (bmi < 30) return "Powyżej zakresu referencyjnego";

    return "Znacznie powyżej zakresu referencyjnego";
  }

  function getPosition() {
    if (bmi === null) return 0;

    return Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));
  }

  return (
    <main className="bmi-page">
      <button
        className="page-back"
        onClick={() => changePage("progress")}
      >
        ← Powrót do postępów
      </button>

      <div className="bmi-heading">
        <div className="bmi-heading-icon">⚖️</div>
        <h1>Kalkulator BMI</h1>
        <p>
          Oblicz wskaźnik masy ciała na podstawie
          wzrostu i wagi.
        </p>
      </div>

      <div className="bmi-layout">
        <div className="bmi-panel">
          <h2>Twoje dane</h2>

          <p className="bmi-muted">
            Wprowadź wartości, aby obliczyć BMI.
          </p>

          <form onSubmit={calculateBMI}>
            <div className="input-group">
              <label>Wzrost (cm)</label>
              <input
                type="number"
                min="1"
                max="300"
                step="0.1"
                required
                placeholder="Np. 175"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  setBmi(null);
                }}
              />
            </div>

            <div className="input-group">
              <label>Waga (kg)</label>
              <input
                type="number"
                min="1"
                max="500"
                step="0.1"
                required
                placeholder="Np. 70"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setBmi(null);
                }}
              />
            </div>

            <button
              className="login-submit"
              type="submit"
            >
              Oblicz BMI →
            </button>
          </form>
        </div>

        <div className="bmi-panel bmi-result-panel">
          <h2>Twój wynik</h2>

          {bmi === null ? (
            <div className="bmi-empty">
              <div className="bmi-empty-icon">📊</div>
              <h3>Wynik pojawi się tutaj</h3>
              <p>
                Wprowadź wzrost i wagę, a następnie
                kliknij przycisk obliczania.
              </p>
            </div>
          ) : (
            <div className="bmi-result">
              <p className="bmi-muted">
                Twój wskaźnik BMI
              </p>

              <div className="bmi-number">
                {bmi.toFixed(1)}
              </div>

              <div className="bmi-category">
                {getCategory()}
              </div>

              <div className="bmi-scale">
                <div className="bmi-scale-bar">
                  <span
                    className="bmi-marker"
                    style={{ left: `${getPosition()}%` }}
                  ></span>
                </div>

                <div className="bmi-scale-labels">
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>

              <p className="bmi-info">
                BMI jest orientacyjnym wskaźnikiem i nie
                uwzględnia m.in. wieku, budowy ciała
                ani ilości tkanki mięśniowej.
                Przedziały dotyczą osób dorosłych.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default BMIPage;