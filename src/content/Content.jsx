import React, { useState, useEffect } from 'react';
import './content.css';
import { getUserData } from '../services/edit';
import Navbar from '../components/NavBar';
import TrashChart from '../graphics/TrashChart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Content = () => {
  const [points, setPoints] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [lockedAchievements, setLockedAchievements] = useState([
    { id: 1, name: '10 Plásticos Reciclados', threshold: 10, type: 'plastic', image: 'trophy.svg' },
    { id: 2, name: '20 Metais Reciclados', threshold: 20, type: 'metal', image: 'trophy.svg' },
    { id: 3, name: '120 Plásticos Reciclados', threshold: 120, type: 'plastic', image: 'trophy.svg' },
    { id: 4, name: '150 Metais Reciclados', threshold: 150, type: 'metal', image: 'trophy.svg' },
  ]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [trashStats, setTrashStats] = useState({ plastic: 0, metal: 0 });
  const [error, setError] = useState(null);
  

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUsername(userData.username);
        setPoints(userData.points)
        
//leva as conquistas p local correto
        setTrashStats({
          plastic: userData.plasticDiscarted || 0,
          metal: userData.metalDiscarted || 0,
        })
      } catch (err) {
        setError('Erro ao carregar dados do usuário');
        toast.error('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // pegar pontos 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setPoints(userData.points);
      } catch (err) {
        setError('Erro ao carregar pontos do usuário');
      }
    };

    fetchUserData();
  }, []);


  // Conquistas
  useEffect(() => {
    const unlocked = [];
    const remaining = [];

    lockedAchievements.forEach((achievement) => {
      switch (achievement.type) {
        case 'plastic':
          // amount exportar da outra pagina??????
          
          trashStats.plastic >= achievement.threshold ? unlocked.push(achievement) : remaining.push(achievement);
          break;
        case 'metal':
          trashStats.metal >= achievement.threshold ? unlocked.push(achievement) : remaining.push(achievement);
          break;
        default:
          remaining.push(achievement);
      }
    });

    setAchievements(unlocked);
    setLockedAchievements(remaining);
  }, [trashStats]);

 
  // Carregar produtos da loja
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/product');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
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


  // Decrementar os pontos quando trocados
  const handlePoints = () => {
    if (selectedProduct && points >= selectedProduct.price) {
      setPoints(points - selectedProduct.price);
      toast.success('Troca realizada com sucesso!');
      handleClosePopUp();
    } else {
      toast.error('Pontos insuficientes para esta troca.');
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
            <div class="achievements-grid">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card">
                  <img src={achievement.image} alt="Troféu" />
                  <p>{achievement.name}</p>
                </div>
              ))}
            </div>
            <h2>Conquistas Bloqueadas</h2>
            <div class="achievements-grid">
          
              {lockedAchievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card blocked">
                  <img src={achievement.image} alt="Troféu Bloqueado" />
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
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
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
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="modal-image"
                />
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
