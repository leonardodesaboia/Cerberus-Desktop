import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../styles/home.css";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import Navbar from "../components/NavbarHome";
import TrashChart from "../components/TrashChart";
import { FaTrophy } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import CardPoints from "../components/CardPoints";

// Welcome Popup Component
// const WelcomePopup = ({ onClose }) => {
//   return (
//     <div className="welcome-popup-overlay">
//       <div className="welcome-popup-content">
//         <h2>Bem-vindo ao EcoPoints!</h2>
//         <p>Recicle materiais, ganhe pontos e conquiste troféus. Juntos podemos fazer a diferença pelo meio ambiente!</p>
//         <button onClick={onClose} className="welcome-close-btn">Entendi</button>
//       </div>
//     </div>
//   );
// };

const Home = () => {
  const [points, setPoints] = useState(0);
  const [trashStats, setTrashStats] = useState({ plastic: 0, metal: 0 });
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  
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

  // Check if welcome popup should be shown (only once)
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcomePopup(true);
    }
  }, []);

  // Handle closing the welcome popup
  const handleCloseWelcomePopup = () => {
    setShowWelcomePopup(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  //  dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        
        setTrashStats({
          plastic: userData.plasticDiscarded || 0,
          metal: userData.metalDiscarded || 0,
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
            
            {unlockedAchievements.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: {
                    slidesPerView: 1.2,
                    spaceBetween: 10
                  },
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 15
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20
                  }
                }}
                className="home-achievements-swiper"
              >
                {unlockedAchievements.map((achievement) => (
                  <SwiperSlide key={achievement.id}>
                    <div className="home-achievement-card">
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
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="empty-achievements">
                <FaTrophy className="empty-trophy-icon" />
                <p>Você ainda não desbloqueou conquistas</p>
                <span className="empty-hint">Continue reciclando para ganhar troféus!</span>
              </div>
            )}
          </section>

          {/* Conquistas Bloqueadas com Barra de Progresso */}
          <section className="achievements-section">
            <h2 className="home-achievements-title">Próximas Conquistas</h2>
            
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                320: {
                  slidesPerView: 1.2,
                  spaceBetween: 10
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 15
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20
                }
              }}
              className="home-achievements-swiper"
            >
              {lockedAchievements.map((achievement) => {
                // Cálculo da porcentagem
                const currentValue = achievement.type === "plastic" ? trashStats.plastic : trashStats.metal;
                const progress = (currentValue / achievement.threshold) * 100;
                const cappedProgress = Math.min(progress, 100);

                return (
                  <SwiperSlide key={achievement.id}>
                    <div className="home-achievement-card locked">
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
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </section>

          <TrashChart trashStats={trashStats} />

          {/* Footer */}
          <footer className="home-footer">
            <p>© EcoPoints | Cerberus 2025</p>
          </footer>
        </div>
      </div>
      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcomePopup} />}
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default Home;