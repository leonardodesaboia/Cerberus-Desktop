import React, { useState, useEffect } from "react";
import "./landingPage.css";
import { Link } from "react-router-dom";

const phrases = [
  "Reciclar é transformar o lixo em solução..",
  "O planeta agradece, recicle suas atitudes.",
  "Reciclar hoje para viver melhor amanhã.",
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Troca de frases automaticamente a cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">Cerberus</div>
        <ul className="navbar-links">
          <li><Link to="/">Início</Link></li>
          <li><Link to="/sobre">Sobre nós</Link></li>
        </ul>
        <Link to="/login" className="login-btn">Login</Link>
      </nav>

      {/* Hero Section com Carrossel de Frases */}
      <div className="carousel">
        {phrases.map((phrase, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? "active" : ""}`}
          >
            {phrase}
          </div>
        ))}

        {/* Botões de navegação */}
        <button
          className="prev"
          onClick={() =>
            setCurrentSlide((prev) => (prev === 0 ? phrases.length - 1 : prev - 1))
          }
        >
          ❮
        </button>
        <button
          className="next"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % phrases.length)
          }
        >
          ❯
        </button>

        {/* Indicadores de página */}
        <div className="indicators">
          {phrases.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
