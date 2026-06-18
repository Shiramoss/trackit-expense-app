// src/components/Layout/Layout.jsx
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Layout({
  children,
  activeMonth,
  setActiveMonth,
  months,
  expenses,
  income,
  user,
  handleLogout,
}) {
  return (
    <div className="app">
      <Navbar
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
        months={months}
        expenses={expenses}
        income={income}
        user={user}
        handleLogout={handleLogout}
      />
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  );
}
