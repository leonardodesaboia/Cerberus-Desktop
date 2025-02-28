import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Menu, X, Recycle } from "lucide-react";
import "../styles/NavbarHome.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <a href="/" className="navbar-brand">
            <Recycle className="h-8 w-8" />
            <span>EcoPoints</span>
          </a>
          
          <div className="navbar-links">
            <a href="#como-funciona" className="navbar-link">Como Funciona</a>
            <Link to="/login">
              <button className="navbar-button-landing">Entrar</button>
            </Link>
          </div>

          <button className="navbar-menu-button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className={`navbar-mobile-menu ${isOpen ? "open" : "closed"}`}>
        <div className="navbar-mobile-links">
          <a href="#como-funciona" className="navbar-link">Como Funciona</a>
          <Link to="/login">
            <button className="navbar-button-landing">Entrar</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
