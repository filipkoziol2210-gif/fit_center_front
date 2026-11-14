import { useState } from "react";

export default function TrainingPlanPage({ changePage }) {
  const days = [
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
    "Niedziela",
  ];

  const [day, setDay] = useState("Poniedziałek");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [plans, setPlans] = useState([]);

  function addPlan(e) {
    e.preventDefault();

    if (!name.trim()) return;

    setPlans([
      ...plans,
      {
        id: Date.now(),
        day,
        name: name.trim(),
        description: description.trim(),
      },
    ]);

    setName("");
    setDescription("");
  }

  function removePlan(id) {
    setPlans(plans.filter((plan) => plan.id !== id));
  }

  return (
    <main className="traininghub-subpage">
      <div className="traininghub-container">
        <button
          className="traininghub-back"
          onClick={() => changePage("training")}
        >
          ← Powrót do treningu
        </button>

        <div className="traininghub-heading">
          <div className="traininghub-heading-icon plan-icon">📋</div>

          <div>
            <span className="traininghub-eyebrow">TWÓJ HARMONOGRAM</span>
            <h1>Plan treningowy</h1>
            <p>Rozplanuj aktywności na poszczególne dni tygodnia.</p>
          </div>
        </div>

        <section className="traininghub-summary plan-summary">
          <div>
            <span className="traininghub-eyebrow">AKTUALNY PLAN</span>
            <h2>Twój tygodniowy harmonogram</h2>
            <p>Dodawaj treningi i organizuj je według własnego planu.</p>
          </div>

          <div className="traininghub-summary-number">
            <strong>{plans.length}</strong>
            <span>zaplanowanych treningów</span>
          </div>
        </section>

        <section className="traininghub-workspace">
          <div className="traininghub-panel plan-form-panel">
            <div className="traininghub-panel-heading">
              <span className="traininghub-panel-icon">＋</span>
              <div>
                <h2>Dodaj do planu</h2>
                <p>Uzupełnij informacje o aktywności.</p>
              </div>
            </div>

            <form className="traininghub-form" onSubmit={addPlan}>
              <label htmlFor="plan-day">Dzień tygodnia</label>

              <select
                id="plan-day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                {days.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label htmlFor="plan-name">Nazwa treningu</label>

              <input
                id="plan-name"
                type="text"
                placeholder="Np. Trening całego ciała"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label htmlFor="plan-description">Opis (opcjonalnie)</label>

              <textarea
                id="plan-description"
                rows="4"
                placeholder="Dodaj informacje o planowanej aktywności..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button className="traininghub-button" type="submit">
                Dodaj trening <span>＋</span>
              </button>
            </form>
          </div>

          <div className="traininghub-panel plan-list-panel">
            <div className="traininghub-panel-heading">
              <span className="traininghub-panel-icon">☷</span>
              <div>
                <h2>Rozkład tygodnia</h2>
                <p>Wszystkie zaplanowane aktywności.</p>
              </div>

              <span className="traininghub-count">{plans.length}</span>
            </div>

            {plans.length === 0 ? (
              <div className="traininghub-empty">
                <span>📅</span>
                <h3>Plan jest jeszcze pusty</h3>
                <p>Dodaj pierwszy trening za pomocą formularza.</p>
              </div>
            ) : (
              <div className="traininghub-plan-list">
                {days.map((item) => {
                  const dayPlans = plans.filter(
                    (plan) => plan.day === item
                  );

                  if (dayPlans.length === 0) return null;

                  return (
                    <div className="traininghub-day-group" key={item}>
                      <h3>{item}</h3>

                      {dayPlans.map((plan) => (
                        <article
                          className="traininghub-plan-entry"
                          key={plan.id}
                        >
                          <div className="traininghub-entry-content">
                            <strong>{plan.name}</strong>

                            {plan.description && (
                              <p>{plan.description}</p>
                            )}
                          </div>

                          <button
                            className="traininghub-delete"
                            onClick={() => removePlan(plan.id)}
                            title="Usuń trening"
                            aria-label={`Usuń ${plan.name}`}
                          >
                            ×
                          </button>
                        </article>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
