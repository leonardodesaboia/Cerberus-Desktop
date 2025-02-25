import { useState, useEffect } from 'react';
import Navbar from '../components/NavbarHome';
import { fetchProductsRedeemed, fetchProductsNotRedeemed, updateUserPoints, updateLog } from "../services/api";
import CardPoints from '../components/CardPoints';
import '../styles/redeemed.css'

const Redeemed = () => {
  const [redeemedProducts, setRedeemedProducts] = useState([]);
  const [notRedeemedProducts, setNotRedeemedProducts] = useState([]);
  const [selectedRedeemed, setSelectedRedeemed] = useState(null);
  const [redeemedLog, setRedeemedLog] = useState([]);

  // pega os prod resgatados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsRedeemed();
        setRedeemedProducts(data);
      } catch (error) {
        console.error("Erro ao carregar os produtos resgatados:", error);
      }
    };
    fetchData();
  }, []);

  // pega os prod nao resgatados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsNotRedeemed();
        setNotRedeemedProducts(data);
      } catch (error) {
        console.error("Erro ao carregar resgates pendentes:", error);
      }
    };
    fetchData();
  }, []);

  // atualiza o log
  useEffect(() => {
    const fetchData = async () => {
      if (selectedRedeemed) {
        try {
          const data = await updateLog(selectedRedeemed);
          setRedeemedLog(data);
        } catch (error) {
          console.error("Erro ao atualizar log:", error);
        }
      }
    };
    fetchData();
  }, [selectedRedeemed]);

  //popup
  const handleRedeemed = (product) => {
    setSelectedRedeemed(product);
  };

//   faz a troca do nn resgatado p resgatado
  const handleRedeemedProd = async () => {
    if (!selectedRedeemed) return;
    
    try {
    //   await updateUserPoints(selectedRedeemed);
    //   filtra pelo id
      setNotRedeemedProducts(notRedeemedProducts.filter(prod => prod._id !== selectedRedeemed._id));
      setRedeemedProducts([...redeemedProducts, selectedRedeemed]);
      setSelectedRedeemed(null);
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
    }
  };

  // popup
  const handleOpenPopUp = () => {
    handleRedeemedProd();
  };

  return (
    <div>
      <Navbar />
      <CardPoints />
      <div className='category-section'>
        <h3 className='category-title'>Resgates Pendentes</h3>
        {notRedeemedProducts.length === 0 ? (
          <p className='no-redeemed-message'>Você ainda não resgatou nenhum produto.</p>
        ) : (
          <div className='carousel-container'>
            <div className='carousel'>
              {notRedeemedProducts.map((product) => (
                <div key={product._id} className="store-product-redeemed-card">
                  <div>
                    <img src={product.img} alt="produto resgatado" className="store-product-redeemed-image" />
                  </div>
                  
                  <button onClick={() => handleRedeemed(product)} className='see-button'>Ver</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="category-section">
        <h3 className="category-title">Produtos resgatados</h3>
        {redeemedProducts.length === 0 ? (
          <p className="no-redeemed-message">Você ainda não resgatou nenhum produto.</p>
        ) : (
          <div className="carousel-container">
            <div className="carousel">
              {redeemedProducts.map((product) => (
                <div key={product._id} className="store-product-redeemed-card">
                  <div>
                    <img src={product.img} alt="produto resgatado" className="store-product-redeemed-image" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedRedeemed && (
          <div className="store-modal-overlay">
            <div className="store-modal-content">
              <img src={selectedRedeemed.img} alt={selectedRedeemed.name} className="store-modal-img" />
              <h2>{selectedRedeemed.name}</h2>
              <p>Código: {selectedRedeemed.code}</p>
              {/* handleOpenPopUp modified to call handleRedeemedProd */}
              <button onClick={handleOpenPopUp} className="store-redeem-button">Resgatar</button>
              <button onClick={() => setSelectedRedeemed(null)} className="store-close-button">Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Redeemed;