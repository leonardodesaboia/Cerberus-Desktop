import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/home.css";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import Navbar from "../components/NavbarHome";
import TrashChart from "../components/TrashChart";
import { FaArrowRight, FaArrowLeft, FaTrophy } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import CardPoints from "../components/CardPoints";

const Home = () => {
  const [points, setPoints] = useState(0);
  const [trashStats, setTrashStats] = useState({ plastic: 0, metal: 0 });
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUnlockedIndex, setActiveUnlockedIndex] = useState(0);
  const [activeLockedIndex, setActiveLockedIndex] = useState(0);
  
  // Refs para os containers de conquistas
  const unlockedGridRef = useRef(null);
  const lockedGridRef = useRef(null);
  
  // Lista de conquistas
  const allAchievements = [
    { id: 1, name: "25 Plásticos Reciclados", threshold: 25, type: "plastic" },
    { id: 2, name: "50 Plásticos Reciclados", threshold: 50, type: "plastic" },
    { id: 3, name: "100 Plásticos Reciclados", threshold: 100, type: "plastic" },
    { id: 4, name: "25 Metais Reciclados", threshold: 25, type: "metal" },
    { id: 5, name: "50 Metais Reciclados", threshold: 50, type: "metal" },
    { id: 6, name: "100 Metais Reciclados", threshold: 100, type: "metal" },
  ];

  // Troféus com lazy loading para melhor performance
  const getTrophyImage = useCallback((threshold) => {
    if (threshold === 25) return "./public/trophys/bronze_trophy.png";
    if (threshold === 50) return "./public/trophys/silver_trophy.png";
    if (threshold === 100) return "./public/trophys/gold_trophy.png";
    return "./public/trophys/locked_trophy.png";
  }, []);

  // Função p navegar no carrossel
  const scrollGrid = useCallback((gridRef, direction, setActiveIndex, itemCount) => {
    if (gridRef.current) {
      const cardWidth = window.innerWidth < 768 ? gridRef.current.offsetWidth * 0.85 : 220;
      const gap = window.innerWidth < 768 ? 16 : 24;
      const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
      
      gridRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Atualizar o indicador ativo
      setTimeout(() => {
        const scrollLeft = gridRef.current.scrollLeft;
        const newIndex = Math.round(scrollLeft / (cardWidth + gap));
        setActiveIndex(Math.max(0, Math.min(newIndex, itemCount - 1)));
      }, 300);
    }
  }, []);

  // Função para ir diretamente para um slide específico
  const goToSlide = useCallback((gridRef, index, setActiveIndex) => {
    if (gridRef.current) {
      const cardWidth = window.innerWidth < 768 ? gridRef.current.offsetWidth * 0.85 : 220;
      const gap = window.innerWidth < 768 ? 16 : 24;
      
      gridRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth'
      });
      
      setActiveIndex(index);
    }
  }, []);

  //  dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        
        setTrashStats({
          plastic: userData.plasticDiscarted || 0,
          metal: userData.metalDiscarted || 0,
        });

        
        if (userData.points !== undefined) {
          setPoints(userData.points);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar seus dados. Por favor, tente novamente mais tarde.");
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Atualizar conquistas desbloqueadas
  useEffect(() => {
    const newUnlockedIds = allAchievements
      .filter((achievement) => {
        if (achievement.type === "plastic") {
          return trashStats.plastic >= achievement.threshold;
        } else if (achievement.type === "metal") {
          return trashStats.metal >= achievement.threshold;
        }
        return false;
      })
      .map((achievement) => achievement.id);

    setUnlockedAchievementIds(newUnlockedIds);
  }, [trashStats]);

  // Filtrar conquistas desbloqueadas e bloqueadas
  const unlockedAchievements = allAchievements.filter((achievement) =>
    unlockedAchievementIds.includes(achievement.id)
  );
  
  const lockedAchievements = allAchievements.filter(
    (achievement) => !unlockedAchievementIds.includes(achievement.id)
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando suas conquistas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home-page-container">
        <div className="home-content-wrapper">
          <CardPoints points={points} />

          {/* Conquistas desbloqueadas */}
          <section className="achievements-section">
            <h2 className="home-achievements-title">Suas Conquistas</h2>
            
            <div className="carousel-container">
              <button 
                className="carousel-control carousel-prev" 
                onClick={() => scrollGrid(unlockedGridRef, 'left', setActiveUnlockedIndex, unlockedAchievements.length)}
                aria-label="Anterior"
                disabled={unlockedAchievements.length <= 3}
              >
                <FaArrowLeft />
              </button>
              
              <div className="home-achievements-grid" ref={unlockedGridRef}>
                {unlockedAchievements.length > 0 ? (
                  unlockedAchievements.map((achievement) => (
                    <div key={achievement.id} className="home-achievement-card">
                      <div className="trophy-container">
                        <img
                          src={getTrophyImage(achievement.threshold)}
                          alt="Troféu"
                          className="home-trophy"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="achievement-name">{achievement.name}</h3>
                      <span className="achievement-badge">Desbloqueado</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-achievements">
                    <FaTrophy className="empty-trophy-icon" />
                    <p>Você ainda não desbloqueou conquistas</p>
                    <span className="empty-hint">Continue reciclando para ganhar troféus!</span>
                  </div>
                )}
              </div>
              
              <button 
                className="carousel-control carousel-next" 
                onClick={() => scrollGrid(unlockedGridRef, 'right', setActiveUnlockedIndex, unlockedAchievements.length)}
                aria-label="Próximo"
                disabled={unlockedAchievements.length <= 3}
              >
                <FaArrowRight />
              </button>
            </div>
            
            {/* Indicadores para mobile */}
            <div className="carousel-indicators mobile-only">
              {unlockedAchievements.length > 0 && unlockedAchievements.map((_, index) => (
                <span 
                  key={index} 
                  className={index === activeUnlockedIndex ? "active" : ""}
                  onClick={() => goToSlide(unlockedGridRef, index, setActiveUnlockedIndex)}
                ></span>
              ))}
            </div>
          </section>

          {/* Conquistas Bloqueadas com Barra de Progresso */}
          <section className="achievements-section">
            <h2 className="home-achievements-title">Próximas Conquistas</h2>
            
            <div className="carousel-container">
              <button 
                className="carousel-control carousel-prev" 
                onClick={() => scrollGrid(lockedGridRef, 'left', setActiveLockedIndex, lockedAchievements.length)}
                aria-label="Anterior"
                disabled={lockedAchievements.length <= 3}
              >
                <FaArrowLeft />
              </button>
              
              <div className="home-achievements-grid" ref={lockedGridRef}>
                {lockedAchievements.map((achievement) => {
                  // Cálculo da porcentagem
                  const currentValue = achievement.type === "plastic" ? trashStats.plastic : trashStats.metal;
                  const progress = (currentValue / achievement.threshold) * 100;
                  const cappedProgress = Math.min(progress, 100);

                  return (
                    <div key={achievement.id} className="home-achievement-card locked">
                      <div className="trophy-container locked">
                        <img
                          src="./public/trophys/locked_trophy.png"
                          alt="Troféu Bloqueado"
                          className="home-trophy"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="achievement-name">{achievement.name}</h3>

                      {/* Barra de progresso */}
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${cappedProgress}%` }}
                        ></div>
                      </div>
                      <div className="progress-stats">
                        <span className="progress-percentage">{cappedProgress.toFixed(0)}%</span>
                        <span className="progress-detail">
                          {currentValue}/{achievement.threshold} {achievement.type === "plastic" ? "plásticos" : "metais"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button 
                className="carousel-control carousel-next" 
                onClick={() => scrollGrid(lockedGridRef, 'right', setActiveLockedIndex, lockedAchievements.length)}
                aria-label="Próximo"
                disabled={lockedAchievements.length <= 3}
              >
                <FaArrowRight />
              </button>
            </div>
            
            {/* Indicadores para mobile */}
            <div className="carousel-indicators mobile-only">
              {lockedAchievements.map((_, index) => (
                <span 
                  key={index} 
                  className={index === activeLockedIndex ? "active" : ""}
                  onClick={() => goToSlide(lockedGridRef, index, setActiveLockedIndex)}
                ></span>
              ))}
            </div>
          </section>

          <TrashChart trashStats={trashStats} />

          {/* Footer */}
          <footer className="home-footer">
            <p>© EcoPoints | Cerberus 2025</p>
          </footer>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default Home;