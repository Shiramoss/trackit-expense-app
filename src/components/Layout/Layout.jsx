// src/components/Layout/Layout.jsx
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

export default function Layout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main className="page-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
