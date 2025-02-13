import React, { useState } from 'react';
import './content.css';

// Dados dos produtos da loja
const storeData = {
  title: "Troque seus pontos por produtos!",
  minPoints: 10,
  products: [
    //puxar da API!!
    { image: "trophy-block.png", price: 10 },
    { image: "trophy.png", price: 50 }
  ]
};

const Content = () => {

  const [points, setPoints] = useState(98)
  const [selectedProduct, setSelectedProduct] = useState(null)
//abrir
  const handleOpenPopUp = (product) =>{
    setSelectedProduct(product)
  }
//fechar
  const handleClosePopUp = ()=>{
    setSelectedProduct(null)
  }

const handlePoints = ()=>{
  if(selectedProduct && points>= selectedProduct.price){
    setPoints(points - selectedProduct.price)
    console.log("clicou")
    alert(`Você trocou seus pontos por ${selectedProduct.name}`)
    handleClosePopUp()
  }else{
    alert("pontos insuficientes!")
  }
}









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
        <h1>{storeData.title}</h1>
        <p>A partir de {storeData.minPoints} pontos</p>
        <div className="store-container">
          {storeData.products.map((product, index) => (
            <div key={index} className="card store-card" onClick={() => handleOpenPopUp(product)}>
              <img src={product.image} alt="Produto" />
              <p>{product.price} pontos</p>
            </div>
          ))}
        </div>
      </div>

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

      {/* Dashboard */}
      <div className="dashboard">
        <div>Gráficos ficam aq</div>
      </div>
    </div>
  );
};

export default Content;
