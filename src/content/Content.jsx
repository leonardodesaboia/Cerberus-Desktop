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
    { id: 1, name: "10 Plásticos Reciclados", threshold: 10, type: "plastic" },
    { id: 2, name: "20 Metais Reciclados", threshold: 20, type: "metal" },
    { id: 3, name: "110 Plásticos Reciclados", threshold: 110, type: "plastic" },
    { id: 4, name: "140 Metais Reciclados", threshold: 140, type: "metal" },
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
              <p className="points-label">Seus pontos acumulados</p>
              <p className="points-value animate-float">{points}</p>
            </div>
          </section>

          {/* Conquistas desbloqueadas do usuário */}
          <div>
            <h2>Suas Conquistas</h2>
            <div className="achievements-grid">
              {unlockedAchievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card">
                  <img src={achievement.image} alt="Troféu" className="trophy golden" />
                  <p>{achievement.name}</p>
                </div>
              ))}
            </div>

            <h2>Conquistas Bloqueadas</h2>
            <div className="achievements-grid">
              {lockedAchievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card blocked">
                  <img src={achievement.image} alt="Troféu Bloqueado"  className="trophy"/>
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
                <button onClick={handleClosePopUp} className="close-button">
                  Fechar
                </button>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-image" />
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.price} pontos</p>
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
