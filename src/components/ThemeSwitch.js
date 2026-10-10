function ThemeSwitch({ darkMode, changeTheme }) {

  return (
    <div className="theme-switch">

      <button
        className={!darkMode ? "active" : ""}
        onClick={() => changeTheme("light")}
        title="Tryb jasny"
      >
        ☀️
      </button>

      <button
        className={darkMode ? "active" : ""}
        onClick={() => changeTheme("dark")}
        title="Tryb ciemny"
      >
        🌙
      </button>

    </div>
  );
}

export default ThemeSwitch;