import React, { useState, useEffect } from "react";
import "./content.css";
import { getUserData, updateUserPoints } from "../services/edit";
import Navbar from "../components/NavBar";
import TrashChart from "../graphics/TrashChart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Content = () => {
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
    { id: 1, name: "5 Plásticos Reciclados", threshold: 5, type: "plastic" },
    { id: 2, name: "10 Metais Reciclados", threshold: 10, type: "metal" },
    { id: 3, name: "20 Plásticos Reciclados", threshold: 20, type: "plastic" },
    { id: 4, name: "35 Metais Reciclados", threshold: 35, type: "metal" },
    { id: 5, name: "40 Plásticos Reciclados", threshold: 40, type: "plastic" },
    { id: 6, name: "55 Metais Reciclados", threshold: 55, type: "metal" },
    { id: 7, name: "65 Plásticos Reciclados", threshold: 65, type: "plastic" },
    { id: 8, name: "70 Metais Reciclados", threshold: 70, type: "metal" },
    { id: 9, name: "100 Metais Reciclados", threshold: 100, type: "plastic" },
    { id: 10, name: "150 Metais Reciclados", threshold: 150, type: "metal" },


  ];

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

  //  conquistas desbloqueadas e bloqueadas
  const unlockedAchievements = allAchievements.filter((achievement) =>
    unlockedAchievementIds.includes(achievement.id)
  );
  const lockedAchievements = allAchievements.filter(
    (achievement) => !unlockedAchievementIds.includes(achievement.id)
  );

  // Carregar produtos da loja
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/product");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  // Abrir popup dos produtos
  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
  };

  // Fechar popup dos produtos
  const handleClosePopUp = () => {
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
      await updateUserPoints(newPoints);
      setPoints(newPoints);
      toast.success("Troca realizada com sucesso!");
      handleClosePopUp();
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
      toast.error("Erro ao atualizar pontos.");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />

      {/* Bem-vindo e pontos */}
      <div className="page-container">
        <div className="content-wrapper">
          <section className="welcome-section">
            <h1 className="welcome-title">Bem-vindo(a), {username}!</h1>
            <div className="points-card">
              <div>
                <p className="points-label">Seus pontos acumulados</p>
                <p className="points-value animate-float">{points}</p>
              </div>
              <img src="./public/coin.png" alt="pontos" className="coin-points" />
            </div>
          </section>

          {/* Conquistas desbloqueadas do usuário */}
          <div>
            <h2 className="achievements-title">Suas Conquistas</h2>
            <div className="achievements-grid">
              {unlockedAchievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card">
                  <img src={'./public/trophy_unblocked.png'} alt="Troféu" className="trophy" />
                  <p>{achievement.name}</p>
                </div>
              ))}
            </div>

            <h2 className="achievements-title">Conquistas Bloqueadas</h2>
            <div className="achievements-grid">
              {lockedAchievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card blocked">
                  <img src={'./public/blocked_trophy.png'} alt="Troféu Bloqueado"  className="trophy"/>
                  <p>{achievement.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Loja de pontos */}
          <section className="store-section">
            <h2 className="section-title">Loja de pontos</h2>
            <div className="store-grid">
              {products.map(
                (product) =>
                  product.isActive && (
                    <div
                      key={product._id}
                      className="product-card"
                      onClick={() => handleOpenPopUp(product)}
                    >
                      <img src={product.img} alt={product.name} className="product-image" />
                      <p>{product.price} pontos</p>
                    </div>
                  )
              )}
            </div>
          </section>


          {/* Gráficos */}
          <TrashChart />

          {/* Popup de troca de pontos */}
          {selectedProduct && (
            <div className="modal-overlay">
              <div className="modal-content">
                <img src={selectedProduct.img} alt={selectedProduct.name} className="modal-image" />
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.price} pontos</p>
                <button onClick={handleClosePopUp} className="close-button">
                  Fechar
                </button>
                <button onClick={handlePoints} className="exchange-button">
                  Trocar
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="footer">
            <p>© Cerberus 2025</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Content;
