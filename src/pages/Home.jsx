import React, { useState, useEffect } from "react";
import "../styles/home.css";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import Navbar from "../components/NavbarHome";
import TrashChart from "../components/TrashChart";
import { FaArrowRight } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [points, setPoints] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trashStats, setTrashStats] = useState({ plastic: 0, metal: 0 });
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState([]);

  // Lista fixa de conquistas
  const allAchievements = [
    { id: 1, name: "25 Plásticos Reciclados", threshold: 25, type: "plastic" },
    { id: 2, name: "50 Plásticos Reciclados", threshold: 50, type: "plastic" },
    { id: 3, name: "100 Plásticos Reciclados", threshold: 100, type: "plastic" },
    { id: 4, name: "25 Metais Reciclados", threshold: 25, type: "metal" },
    { id: 5, name: "50 Metais Reciclados", threshold: 50, type: "metal" },
    { id: 6, name: "100 Metais Reciclados", threshold: 100, type: "metal" }
  ];

  // trofeus 
  const getTrophyImage = (threshold) => {
    if (threshold === 25) return "./public/trophys/bronze_trophy.png";
    if (threshold === 50) return "./public/trophys/silver_trophy.png";
    if (threshold === 100) return "./public/trophys/gold_trophy.png";
    return "./public/trophys/locked_trophy.png"; // fallback
  };

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUsername(userData.username);
        setPoints(userData.points);
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

  // Carregar produtos da loja
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
        toast.error("Erro ao carregar os produtos.");
      }
    };
    fetchData();
  }, []);

  // Abrir popup dos produtos
  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
  };

  // Fechar popup dos produtos
  const  handleClosePopUp = () => {
    setSelectedProduct(null);
  };

  // Decrementar os pontos ao trocar por um produto
  const handlePoints = async () => {
    if (!selectedProduct) return;

    const newPoints = parseInt(points, 10) - selectedProduct.price;
    if (newPoints < 0) {
      toast.error("Pontos insuficientes para esta troca.");
      return;
    }

    try {
      await updateUserPoints(selectedProduct);
      setPoints(newPoints);
      toast.success("Troca realizada com sucesso!");
      handleClosePopUp();
      Toast.success("Pontos trocados com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
      
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;



  return (
    <>
      <Navbar />

      <div className="home-page-container">
        <div className="home-content-wrapper">
          <section className="home-welcome-section">
            <h1 className="home-welcome-title">Bem-vindo(a), {username}!</h1>
            <div className="home-points-card">
              <p className="home-points-label">Seus pontos acumulados:</p>
              <p className="home-points-value animate-float">{points}</p>
              <img src="./coin.png" alt="" className="coin-points" />
            </div>
          </section>

          {/* Conquistas desbloqueadas */}
          <h2 className="home-achievements-title">Suas Conquistas</h2>
          <div className="home-achievements-grid">
            {unlockedAchievements.map((achievement) => (
              <div key={achievement.id} className="home-achievement-card">
               <img src={getTrophyImage(achievement.threshold)} alt="Troféu" className="home-trophy" />
                <p>{achievement.name}</p>
              </div>
            ))}
          </div>

          {/* Conquistas Bloqueadas com Barra de Progresso */}
          <h2 className="home-achievements-title">Conquistas Bloqueadas</h2>
          <div className="home-achievements-grid">
            {lockedAchievements.map((achievement) => {
              // calculo da porcentagem
              const progress = achievement.type === "plastic"
                ? (trashStats.plastic / achievement.threshold) * 100
                : (trashStats.metal / achievement.threshold) * 100;

              return (
                //pega pelo id 
                <div key={achievement.id} className="home-achievement-card blocked">
                  <img src={'./public/trophys/locked_trophy.png'} alt="Troféu Bloqueado" className="home-trophy" />
                  <p>{achievement.name}</p>

                  {/* Barra de progresso */}
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                  </div>
                  {/* calculo tb */}
                  <p>{Math.min(progress, 100).toFixed(0)}%</p>
                </div>
              );
            })}
          </div>

          {/* Loja de pontos */}
          <section className="home-store-section">
            <h2 className="home-section-title">Loja de pontos</h2>
            <a href="" className="">Ver mais <FaArrowRight/> </a>
            <div className="home-store-grid">
              {products.map(
                (product) =>
                  product.isActive && (
                    <div
                      key={product._id}
                      className="home-product-card"
                      onClick={() => handleOpenPopUp(product)}
                    >
                      <img src={product.img} alt={product.name} className="home-product-image" />
                      <p className="home-product-pricee">{product.price} pontos</p>
                    </div>
                  )
              )}
            </div>
          </section>

          <TrashChart />
          {/* Popup de troca de pontos */}
          {selectedProduct && (
            <div className="home-modal-overlay">
              <div className="home-modal-content">
                <img src={selectedProduct.img} alt={selectedProduct.name} className="home-modal-image" />
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.price} pontos</p>
                <button onClick={handleClosePopUp} className="home-close-button">
                  Fechar
                </button>
                <button onClick={handlePoints} className="home-exchange-button">
                  Trocar
                </button>
              </div>
            </div>
          )}


          {/* Footer */}
          <footer className="home-footer">
            <p>© Cerberus 2025</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home;
