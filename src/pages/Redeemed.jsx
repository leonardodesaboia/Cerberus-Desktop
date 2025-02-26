import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/NavbarHome';
import { fetchProductsRedeemed, fetchProductsNotRedeemed, updateUserPoints, updateLog } from "../services/api";
import CardPoints from '../components/CardPoints';
import '../styles/redeemed.css';

const Redeemed = () => {
  const [redeemedProducts, setRedeemedProducts] = useState([]);
  const [notRedeemedProducts, setNotRedeemedProducts] = useState([]);
  const [selectedRedeemed, setSelectedRedeemed] = useState(null);
  const [redeemedLog, setRedeemedLog] = useState([]);
  
  // Refs for the carousel containers
  const pendingCarouselRef = useRef(null);
  const redeemedCarouselRef = useRef(null);

  // Fetch redeemed products
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

  // Fetch not redeemed products
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

  // Update log
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

  // Popup
  const handleRedeemed = (product) => {
    setSelectedRedeemed(product);
  };

  // Change not redeemed to redeemed
  const handleRedeemedProd = async () => {
    if (!selectedRedeemed) return;
    
    try {
      // await updateUserPoints(selectedRedeemed);
      // Filter by id
      setNotRedeemedProducts(notRedeemedProducts.filter(prod => prod._id !== selectedRedeemed._id));
      setRedeemedProducts([...redeemedProducts, selectedRedeemed]);
      setSelectedRedeemed(null);
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
    }
  };

  // Popup
  const handleOpenPopUp = () => {
    handleRedeemedProd();
  };

  // Carousel navigation functions
  const scrollCarousel = (direction, carouselRef) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="redeemed-container">
      <Navbar />
      <CardPoints />
      
      {/* Pending Redemptions Section */}
      <div className="category-section">
        <h3 className="category-title">Resgates Pendentes</h3>
        
        {notRedeemedProducts.length === 0 ? (
          <p className="no-redeemed-message">Você ainda não resgatou nenhum produto.</p>
        ) : (
          <div className="carousel-wrapper">
            <button 
              className="carousel-arrow carousel-arrow-left" 
              onClick={() => scrollCarousel('left', pendingCarouselRef)}
              aria-label="Scroll left"
            >
              &lt;
            </button>
            
            <div className="carousel-container">
              <div className="carousel" ref={pendingCarouselRef}>
                {notRedeemedProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-image-container">
                      <img src={product.img} alt="produto a resgatar" className="product-image" />
                    </div>
                    <button onClick={() => handleRedeemed(product)} className="see-button">
                      Ver
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="carousel-arrow carousel-arrow-right" 
              onClick={() => scrollCarousel('right', pendingCarouselRef)}
              aria-label="Scroll right"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* Redeemed Products Section */}
      <div className="category-section">
        <h3 className="category-title">Produtos Resgatados</h3>
        
        {redeemedProducts.length === 0 ? (
          <p className="no-redeemed-message">Você ainda não resgatou nenhum produto.</p>
        ) : (
          <div className="carousel-wrapper">
            <button 
              className="carousel-arrow carousel-arrow-left" 
              onClick={() => scrollCarousel('left', redeemedCarouselRef)}
              aria-label="Scroll left"
            >
              &lt;
            </button>
            
            <div className="carousel-container">
              <div className="carousel" ref={redeemedCarouselRef}>
                {redeemedProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-image-container">
                      <img src={product.img} alt="produto resgatado" className="product-image" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="carousel-arrow carousel-arrow-right" 
              onClick={() => scrollCarousel('right', redeemedCarouselRef)}
              aria-label="Scroll right"
            >
              &gt;
            </button>
          </div>
        )}

        {/* Product Modal */}
        {selectedRedeemed && (
          <div className="modal-overlay">
            <div className="modal-content">
              <img src={selectedRedeemed.img} alt={selectedRedeemed.name} className="modal-img" />
              <h2>{selectedRedeemed.name}</h2>
              <p>Código: {selectedRedeemed.code}</p>
              <div className="modal-buttons">
                <button onClick={handleOpenPopUp} className="redeem-button">Resgatar</button>
                <button onClick={() => setSelectedRedeemed(null)} className="close-button">Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Redeemed;