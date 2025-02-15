import React, { useState, useEffect } from 'react';
import './content.css';
import { getUserData } from '../services/edit';
import Navbar from '../components/NavBar';
import TrashChart from '../graphics/TrashChart';

const Content = () => {
  const [points, setPoints] = useState(98);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUsername(userData.username);
      } catch (err) {
        setError('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePopUp = () => {
    setSelectedProduct(null);
  };

  const handlePoints = () => {
    if (selectedProduct && points >= selectedProduct.price) {
      setPoints(points - selectedProduct.price);
      handleClosePopUp();
    } else {
      return
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="content-wrapper">
          <section className="welcome-section">
            <h1 className="welcome-title">Bem vindo(a), {username}!</h1>
            <div className="points-card">
              <p className="points-label">Seus pontos acumulados</p>
              <p className="points-value animate-float">{points}</p>
            </div>
          </section>

          <section className="achievements-section">
            <h2 className="section-title">Suas Conquistas</h2>
            <div className="achievements-grid">
              <div className="achievement-card">
                <img src="trophy.png" alt="Troféu" />
                <p>10 metais descartados</p>
              </div>
              <div className="achievement-card blocked">
                <img src="trophy-block.png" alt="Troféu Bloqueado" />
                <p>Descarte 10 plásticos</p>
              </div>
            </div>
          </section>

          <section className="store-section">
            <h2 className="section-title">Loja de pontos</h2>
            <p className="store-subtitle">A partir de 10 pontos</p>
            <div className="store-grid">
              {products.map((product) => (
                product.isActive && (
                  <div key={product._id} className="product-card" onClick={() => handleOpenPopUp(product)}>
                    <img src={product.image} alt={product.name} className="product-image" />
                    <p>{product.price} pontos</p>
                  </div>
                )
              ))}
            </div>
          </section>

          <TrashChart />

          {selectedProduct && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button onClick={handleClosePopUp} className="close-button">Fechar</button>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-image" />
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.price} pontos</p>
                <button onClick={handlePoints} className="exchange-button">Trocar</button>
              </div>
            </div>
          )}

          <footer className="footer">
            <a href="#" className="footer-link">Conheça nosso aplicativo</a>
            <p>© Cerberus 2025</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Content;
