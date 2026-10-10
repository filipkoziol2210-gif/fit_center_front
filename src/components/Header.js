import logo from "../ikonka.png";
import ThemeSwitch from "./ThemeSwitch";

function Header({ darkMode, changeTheme, changePage }) {

  return (
    <header>

      <div
        className="brand"
        onClick={() => changePage("home")}
      >
        <img src={logo} alt="Fit Center" />

        <h2>FIT CENTER</h2>
      </div>


      <ThemeSwitch
        darkMode={darkMode}
        changeTheme={changeTheme}
      />

    </header>
  );
}

export default Header;