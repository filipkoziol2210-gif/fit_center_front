import { useState } from "react";

function MealsPage({ changePage }) {

  const [name, setName] = useState("");
  const [mealType, setMealType] = useState("Śniadanie");
  const [description, setDescription] = useState("");

  const [meals, setMeals] = useState([]);

  const categories = [
    { name: "Śniadanie", icon: "🌅" },
    { name: "Obiad", icon: "🍲" },
    { name: "Kolacja", icon: "🌙" },
    { name: "Przekąski", icon: "🍎" }
  ];

  function addMeal(e) {
    e.preventDefault();

    if (!name.trim()) return;

    setMeals([
      ...meals,
      {
        id: Date.now(),
        name,
        description,
        type: mealType
      }
    ]);

    setName("");
    setDescription("");
  }

  function removeMeal(id) {
    setMeals(meals.filter(meal => meal.id !== id));
  }

  return (
    <main className="food-subpage meals-page">

      <button
        className="page-back"
        onClick={() => changePage("diet")}
      >
        ← Powrót do diety
      </button>

      <div className="meals-header">
        <span className="diet-eyebrow">TWÓJ DZIENNIK ŻYWIENIA</span>
        <h1>Plan posiłków</h1>
        <p>
          Zapisuj posiłki i organizuj swój dziennik żywienia.
        </p>
      </div>

      <div className="meals-layout">

        <section className="meal-form-panel">

          <h2>Dodaj posiłek</h2>

          <form onSubmit={addMeal}>

            <div className="input-group">
              <label>Nazwa posiłku</label>
              <input
                type="text"
                placeholder="Np. Owsianka z owocami"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Rodzaj posiłku</label>

              <select
                value={mealType}
                onChange={e => setMealType(e.target.value)}
              >
                {categories.map(category => (
                  <option
                    key={category.name}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Opis (opcjonalnie)</label>
              <textarea
                placeholder="Np. Płatki owsiane, mleko, banan..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows="4"
              />
            </div>

            <button className="login-submit" type="submit">
              + Dodaj do dziennika
            </button>

          </form>

        </section>

        <section className="meal-timeline">

          <div className="meal-timeline-heading">
            <h2>Twój dziennik</h2>
            <span>{meals.length} wpisów</span>
          </div>

          {categories.map(category => {

            const categoryMeals = meals.filter(
              meal => meal.type === category.name
            );

            return (

              <div className="meal-category" key={category.name}>

                <div className="meal-category-heading">
                  <span>{category.icon}</span>
                  <h3>{category.name}</h3>
                  <span className="meal-count">
                    {categoryMeals.length}
                  </span>
                </div>

                {categoryMeals.length === 0 ? (

                  <p className="meal-empty">
                    Brak dodanych posiłków
                  </p>

                ) : (

                  categoryMeals.map(meal => (

                    <div className="meal-entry" key={meal.id}>

                      <div>
                        <strong>{meal.name}</strong>

                        {meal.description && (
                          <p>{meal.description}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className="delete-food"
                        onClick={() => removeMeal(meal.id)}
                      >
                        ×
                      </button>

                    </div>

                  ))

                )}

              </div>

            );

          })}

        </section>

      </div>

    </main>
  );
}

export default MealsPage;
