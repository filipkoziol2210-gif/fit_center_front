import { useState } from "react";

export default function MealsPage({ changePage }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mealType, setMealType] = useState("Śniadanie");
  const [meals, setMeals] = useState([]);

  const categories = [
    { name: "Śniadanie", icon: "🌅" },
    { name: "Obiad", icon: "🍲" },
    { name: "Kolacja", icon: "🌙" },
    { name: "Przekąski", icon: "🍎" },
  ];

  function addMeal(e) {
    e.preventDefault();

    if (!name.trim()) return;

    setMeals([
      ...meals,
      {
        id: Date.now(),
        name: name.trim(),
        description: description.trim(),
        type: mealType,
      },
    ]);

    setName("");
    setDescription("");
  }

  function removeMeal(id) {
    setMeals(meals.filter((meal) => meal.id !== id));
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
          <div className="nutrition-heading-icon meals-icon">🍽️</div>

          <div>
            <h1>Dziennik posiłków</h1>
            <p>Twórz własny dziennik i zapisuj spożywane posiłki.</p>
          </div>
        </header>

        <section className="meals-intro">
          <div>
            <span className="nutrition-eyebrow">TWÓJ DZIENNIK</span>
            <h2>Codzienne posiłki</h2>
            <p>
              Dodawaj posiłki i przypisuj je do odpowiednich kategorii.
            </p>
          </div>

          <div className="meals-intro-stat">
            <strong>{meals.length}</strong>
            <span>zapisanych posiłków</span>
          </div>
        </section>

        <section className="meals-layout">
          <div className="nutrition-panel meals-form-panel">
            <div className="nutrition-panel-heading">
              <span className="panel-icon">＋</span>
              <div>
                <h2>Nowy posiłek</h2>
                <p>Dodaj pozycję do swojego dziennika.</p>
              </div>
            </div>

            <form className="nutrition-form" onSubmit={addMeal}>
              <label htmlFor="meal-name">Nazwa posiłku</label>
              <input
                id="meal-name"
                type="text"
                placeholder="Np. Kanapki z jajkiem"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label htmlFor="meal-type">Kategoria</label>
              <select
                id="meal-type"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label htmlFor="meal-description">Opis (opcjonalnie)</label>
              <textarea
                id="meal-description"
                placeholder="Dodaj krótki opis posiłku..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />

              <button className="nutrition-primary-button" type="submit">
                Zapisz posiłek <span>＋</span>
              </button>
            </form>
          </div>

          <div className="meals-board">
            {categories.map((category) => {
              const categoryMeals = meals.filter(
                (meal) => meal.type === category.name
              );

              return (
                <section className="meal-category-panel" key={category.name}>
                  <div className="meal-category-heading">
                    <div className="meal-category-title">
                      <span>{category.icon}</span>
                      <h2>{category.name}</h2>
                    </div>

                    <span className="nutrition-count">
                      {categoryMeals.length}
                    </span>
                  </div>

                  {categoryMeals.length === 0 ? (
                    <p className="meal-category-empty">
                      Brak dodanych posiłków
                    </p>
                  ) : (
                    <div className="meal-category-list">
                      {categoryMeals.map((meal) => (
                        <article className="meal-entry" key={meal.id}>
                          <div className="meal-entry-content">
                            <strong>{meal.name}</strong>
                            {meal.description && (
                              <p>{meal.description}</p>
                            )}
                          </div>

                          <button
                            className="nutrition-delete-button"
                            onClick={() => removeMeal(meal.id)}
                            aria-label={`Usuń ${meal.name}`}
                            title="Usuń posiłek"
                          >
                            ×
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
