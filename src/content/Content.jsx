import React, { useState, useEffect } from 'react';
import './content.css';

const Content = () => {
  const [points, setPoints] = useState(98);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]); // Novo estado para armazenar os produtos

  
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/product'); 
      const data = await response.json();
      setProducts(data); 
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
    }
  };

  // Carregar os produtos quando o componente for montado
  useEffect(() => {
    fetchProducts(); // Chama a função de busca assim que o componente for montado
  }, []);

  // Função para abrir o pop-up com os detalhes do produto
  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
  };

  // Função para fechar o pop-up
  const handleClosePopUp = () => {
    setSelectedProduct(null);
  };

  // Função para trocar pontos por um produto
  const handlePoints = () => {
    if (selectedProduct && points >= selectedProduct.price) {
      setPoints(points - selectedProduct.price);
      alert(`Você trocou seus pontos por ${selectedProduct.name}`);
      handleClosePopUp(); // Fecha o pop-up após a troca
    } else {
      alert("Pontos insuficientes ou produto indisponível!");
    }
  };

  return (
    <div className="content-container">
      {/* Seção de pontos */}
      <div className="points-section">
        <div className="points-label">Seu saldo de pontos</div>
        <div className="points-value">{points}</div>
      </div>
  
      {/* Seção de conquistas */}
      <div className="achievements">
        <h1>Suas Conquistas</h1>
        <div className="achievements-container">
          <div className="card achievement-card">
            <img src="trophy.png" alt="Troféu" />
            <p>10 metais descartados</p>
          </div>
        </div>
      </div>
  
      {/* Seção de conquistas bloqueadas */}
      <div className="achievements-block">
        <h1>Conquistas Bloqueadas</h1>
        <div className="achievements-container">
          <div className="card blocked-card">
            <img src="trophy-block.png" alt="Troféu Bloqueado" />
            <p>Descarte 10 plásticos</p>
          </div>
        </div>
      </div>
  
      {/* Seção da loja */}
      <div className="store">
        <h1>Loja de Pontos</h1>
        <p>A partir de 10 pontos</p>
        <div className="store-container">
          {products.map((product) => (
            product.isActive && (
              <div
                key={product._id}
                className="card store-card"
                onClick={() => handleOpenPopUp(product)}
              >
                <img src={product.image} alt={product.name} />
                <p>{product.price} pontos</p>
              </div>
            )
          ))}
        </div>
      </div>
  
      {/* Pop-up para detalhes do produto */}
      {selectedProduct && (
        <div className="popup">
          <div className="popup-content">
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <p>Preço: {selectedProduct.price} pontos</p>
            <button onClick={handlePoints}>Trocar</button>
            <button className="close-btn-points" onClick={handleClosePopUp}>Fechar</button>
          </div>
        </div>
      )}
  
      {/* Dashboard (não implementado, mas a estrutura está aqui) */}
      <div className="dashboard">
        <div>Gráficos ficam aqui</div>
      </div>
  
      {/* Footer */}
      <footer className="footer">
        <h4> <a href="">Conheça nosso aplicativo</a></h4>
        <p>Cerberus 2025</p>
      </footer>
    </div>
  );
};

export default Content;
