import React, { useState, useEffect } from "react";
import "./landingPage.css";
import { Link } from "react-router-dom";
import { MdOutlineRecycling } from "react-icons/md";

const carouselData = [
  {
    phrase: "Reciclar é transformar o lixo em solução.",
    image: "./lixeira.jpg",
  },
  {
    phrase: "O planeta agradece, recicle suas atitudes.",
    image: "./lixo.jpg",
  },
  {
    phrase: "Reciclar hoje para viver melhor amanhã.",
    image: "./trash.jpg",
  },
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Troca slide a cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">Cerberus</div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="nav-link">Início</Link>
          </li>
          <li>
            <Link
              to="/"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("sobre-nos").scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Sobre nós
            </Link>
          </li>
        </ul>
        <Link to="/login" className="login-btn">Login</Link>
      </nav>

      {/* Hero Section com Carrossel de Frases e Imagens */}
      <div className="carousel">
        {carouselData.map((item, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="slide-content">
              {item.phrase}
            </div>
          </div>
        ))}

        {/* Botões de navegação */}
        <button
          className="prev"
          onClick={() =>
            setCurrentSlide((prev) => (prev === 0 ? carouselData.length - 1 : prev - 1))
          }
        >
          ❮
        </button>
        <button
          className="next"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % carouselData.length)
          }
        >
          ❯
        </button>

        {/* Indicadores de página */}
        <div className="indicators">
          {carouselData.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Sobre nós */}
      <div id="sobre-nos" className="about-us">
        <h2>Sobre nós</h2>
        <p>
          Somos uma empresa inovadora comprometida em transformar a maneira como o mundo lida com resíduos. <br />
          Com tecnologia de ponta e um olhar voltado para a sustentabilidade, desenvolvemos a Lixeira Inteligente, uma solução que une praticidade, eficiência e cuidado com o meio ambiente. <br />
          Nosso objetivo é simplificar o dia a dia das pessoas e das empresas, ao mesmo tempo em que contribuímos para um futuro mais verde. <br />
          Acreditamos que pequenas mudanças, como uma lixeira mais inteligente, podem gerar grandes impactos. <br />
          <strong>Junte-se a nós nessa missão e faça parte da revolução na gestão de resíduos! 🌱✨</strong>
        </p>
      </div>

      {/* Containers dos 3 R's da Reciclagem */}
      <div className="container">
        <div className="recycle-container">
          <MdOutlineRecycling />
          <h3>Reduzir</h3>
          <p>
            Reduzir significa diminuir a quantidade de resíduos que geramos. <br />
            Isso pode ser feito através do consumo consciente, evitando o desperdício e optando por produtos com menos embalagens.
          </p>
        </div>
        <div className="recycle-container">
          <MdOutlineRecycling />
          <h3>Reutilizar</h3>
          <p>
            Reutilizar envolve dar uma nova vida aos produtos e materiais que já foram usados. <br />
            Em vez de descartar, podemos consertar, transformar ou usar de outra forma, prolongando sua utilidade.
          </p>
        </div>
        <div className="recycle-container">
          <MdOutlineRecycling />
          <h3>Reciclar</h3>
          <p>
            Reciclar é o processo de transformar resíduos em novos produtos. <br />
            Isso ajuda a reduzir a extração de recursos naturais, economiza energia e diminui a quantidade de lixo que vai para aterros sanitários.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;