import React, { useState, useEffect, useRef } from "react";
import "../styles/home.css";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import Navbar from "../components/NavbarHome";
import TrashChart from "../components/TrashChart";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import CardPoints from "../components/CardPoints";

const Home = () => {
  const [points, setPoints] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trashStats, setTrashStats] = useState({ plastic: 0, metal: 0 });
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState([]);
  
  // Refs para os containers de conquistas
  const unlockedGridRef = useRef(null);
  const lockedGridRef = useRef(null);
  
  // Lista fixa de conquistas
  const allAchievements = [
    { id: 1, name: "25 Plásticos Reciclados", threshold: 25, type: "plastic" },
    { id: 2, name: "50 Plásticos Reciclados", threshold: 50, type: "plastic" },
    { id: 3, name: "100 Plásticos Reciclados", threshold: 100, type: "plastic" },
    { id: 4, name: "25 Metais Reciclados", threshold: 25, type: "metal" },
    { id: 5, name: "50 Metais Reciclados", threshold: 50, type: "metal" },
    { id: 6, name: "100 Metais Reciclados", threshold: 100, type: "metal" },
  ];

  // Troféus
  const getTrophyImage = (threshold) => {
    if (threshold === 25) return "./public/trophys/bronze_trophy.png" ;
    if (threshold === 50) return "./public/trophys/silver_trophy.png";
    if (threshold === 100) return "./public/trophys/gold_trophy.png";
    return "./public/trophys/locked_trophy.png"; // fallback
  };

  // Funções para navegar nos carrosséis
  const scrollGrid = (gridRef, direction) => {
    if (gridRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      gridRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        
        setTrashStats({
          plastic: userData.plasticDiscarted || 0,
          metal: userData.metalDiscarted || 0,
        });
      } catch (err) {
        setError("Erro ao carregar dados do usuário");
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Atualizar conquistas desbloqueadas
  useEffect(() => {
    // filtra pelo id
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="home-page-container">
        <CardPoints />
        <div className="home-content-wrapper">

          {/* Conquistas desbloqueadas */}
          <div className="achievements-section">
            <h2 className="home-achievements-title">Suas Conquistas</h2>
            
            <div className="carousel-container">
              <button 
                className="carousel-control carousel-prev" 
                onClick={() => scrollGrid(unlockedGridRef, 'left')}
                aria-label="Anterior"
              >
                <FaArrowLeft />
              </button>
              
              <div className="home-achievements-grid" ref={unlockedGridRef}>
                {unlockedAchievements.length > 0 ? (
                  unlockedAchievements.map((achievement) => (
                    <div key={achievement.id} className="home-achievement-card">
                      <img
                        src={getTrophyImage(achievement.threshold)}
                        alt="Troféu"
                        className="home-trophy"
                      />
                      <p>{achievement.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-achievements">
                    <p>Você ainda não desbloqueou conquistas</p>
                  </div>
                )}
              </div>
              
              <button 
                className="carousel-control carousel-next" 
                onClick={() => scrollGrid(unlockedGridRef, 'right')}
                aria-label="Próximo"
              >
                <FaArrowRight />
              </button>
            </div>
            
            {/* Indicadores para mobile */}
            <div className="carousel-indicators mobile-only">
              {Array(Math.ceil(unlockedAchievements.length / 2)).fill().map((_, index) => (
                <span key={index} className={index === 0 ? "active" : ""}></span>
              ))}
            </div>
          </div>

          {/* Conquistas Bloqueadas com Barra de Progresso */}
          <div className="achievements-section">
            <h2 className="home-achievements-title">Conquistas Bloqueadas</h2>
            
            <div className="carousel-container">
              <button 
                className="carousel-control carousel-prev" 
                onClick={() => scrollGrid(lockedGridRef, 'left')}
                aria-label="Anterior"
              >
                <FaArrowLeft />
              </button>
              
              <div className="home-achievements-grid" ref={lockedGridRef}>
                {lockedAchievements.map((achievement) => {
                  // Cálculo da porcentagem
                  const progress =
                    achievement.type === "plastic"
                      ? (trashStats.plastic / achievement.threshold) * 100
                      : (trashStats.metal / achievement.threshold) * 100;

                  return (
                    <div key={achievement.id} className="home-achievement-card blocked">
                      <img
                        src="./public/trophys/locked_trophy.png"
                        alt="Troféu Bloqueado"
                        className="home-trophy"
                      />
                      <p>{achievement.name}</p>

                      {/* Barra de progresso */}
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                      </div>
                      <p>{Math.min(progress, 100).toFixed(0)}%</p>
                    </div>
                  );
                })}
              </div>
              
              <button 
                className="carousel-control carousel-next" 
                onClick={() => scrollGrid(lockedGridRef, 'right')}
                aria-label="Próximo"
              >
                <FaArrowRight />
              </button>
            </div>
            
            {/* Indicadores para mobile */}
            <div className="carousel-indicators mobile-only">
              {Array(Math.ceil(lockedAchievements.length / 2)).fill().map((_, index) => (
                <span key={index} className={index === 0 ? "active" : ""}></span>
              ))}
            </div>
          </div>

          <TrashChart />

          {/* Footer */}
          <footer className="home-footer">
            <p>© EcoPoints | Cerberus 2025</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home;