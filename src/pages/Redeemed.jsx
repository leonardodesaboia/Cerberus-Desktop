import { useState, useEffect } from 'react';
import Navbar from '../components/NavbarHome';
import { fetchProductsRedeemed, fetchProductsNotRedeemed, fetchProducts, updateLog } from "../services/api";
import CardPoints from '../components/CardPoints';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import "../styles/store.css";
import '../styles/redeemed.css';

const Redeemed = () => {
  const [redeemedProducts, setRedeemedProducts] = useState([]);
  const [notRedeemedProducts, setNotRedeemedProducts] = useState([]);
  const [selectedRedeemed, setSelectedRedeemed] = useState(null);
  const [redeemedPopup, setRedeemedPopup] = useState(null); 
  const [products, setProducts] = useState([]);
  const [redeemedLog, setRedeemedLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [redeemedData, notRedeemedData, productsData] = await Promise.all([
          fetchProductsRedeemed(),
          fetchProductsNotRedeemed(),
          fetchProducts()
        ]);
        
        setRedeemedProducts(redeemedData);
        setNotRedeemedProducts(notRedeemedData);
        setProducts(productsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  useEffect(() => {
    const updateLogData = async () => {
      if (selectedRedeemed) {
        try {
          const data = await updateLog(selectedRedeemed);
          setRedeemedLog(data);
        } catch (error) {
          console.error("Erro ao atualizar log:", error);
        }
      }
    };
    
    updateLogData();
  }, [selectedRedeemed]);

  const handleRedeemed = (product) => {
    setSelectedRedeemed(product);
  };

  const handleRedeemedProd = async () => {
    if (!selectedRedeemed) return;
    
    try {
      setNotRedeemedProducts(notRedeemedProducts.filter(prod => prod._id !== selectedRedeemed._id));
      setRedeemedProducts([...redeemedProducts, selectedRedeemed]);
      setRedeemedPopup(selectedRedeemed);
      setSelectedRedeemed(null);
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
    }
  };

  const handleOpenPopUp = () => {
    handleRedeemedProd();
  };

  const handleShowRedeemedPopUp = (product) => {
    setRedeemedPopup(product);
  };

  const closeRedeemedPopup = () => {
    setRedeemedPopup(null);
  };

  // Swiper breakpoints for responsiveness
  const swiperBreakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 30
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 40
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 50
    }
  };

  if (loading) {
    return (
      <div className="redeemed-loading">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="redeemed-container">
      <Navbar />
      <div className="redeemed-content">
        <CardPoints />
        
        <div className="category-section">
          <h3 className="category-title">Resgates Pendentes</h3>
          {notRedeemedProducts.length === 0 ? (
            <div className="empty-state">
              <p className="no-redeemed-message">Você ainda não tem resgates pendentes.</p>
            </div>
          ) : (
            <div className="swiper-wrapper-custom">
              <Swiper 
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={swiperBreakpoints}
                navigation={{
                  prevEl: '.swiper-button-prev-custom',
                  nextEl: '.swiper-button-next-custom'
                }}
                modules={[Navigation]} 
                className="swiper-container">
                {notRedeemedProducts.map((product) => (
                  <SwiperSlide key={product._id}>
                    <div className="product-card-no-redeemed">
                      <div className="product-image-container">
                        <img src={product.img} alt={product.name || "Produto a resgatar"} className="product-image" />
                      </div>
                      <h4 className="product-name">{product.name}</h4>
                      <button onClick={() => handleRedeemed(product)} className="see-button">
                        Ver Detalhes
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-navigation-custom">
                <div className="swiper-button-prev-custom"></div>
                <div className="swiper-button-next-custom"></div>
              </div>
            </div>
          )}
        </div>

        <div className="category-section">
          <h3 className="category-title">Produtos Resgatados</h3>
          {redeemedProducts.length === 0 ? (
            <div className="empty-state">
              <p className="no-redeemed-message">Você ainda não resgatou nenhum produto.</p>
            </div>
          ) : (
            <div className="swiper-wrapper-custom">
              <Swiper 
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={swiperBreakpoints}
                navigation={{
                  prevEl: '.swiper-button-prev-custom-redeemed',
                  nextEl: '.swiper-button-next-custom-redeemed'
                }}
                modules={[Navigation]} 
                className="swiper-container">
                {redeemedProducts.map((product) => (
                  <SwiperSlide key={product._id}>
                    <div className="product-card">
                      <div className="product-image-container">
                        <img src={product.img} alt={product.name || "Produto resgatado"} className="product-image" />
                      </div>
                      <h4 className="product-name">{product.name}</h4>
                      <button onClick={() => handleShowRedeemedPopUp(product)} className="see-button">
                        Ver Detalhes
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-navigation-custom">
                <div className="swiper-button-prev-custom-redeemed"></div>
                <div className="swiper-button-next-custom-redeemed"></div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedRedeemed && (
          <div className="modal-overlay" onClick={() => setSelectedRedeemed(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Detalhes do Produto</h2>
                <button onClick={() => setSelectedRedeemed(null)} className="modal-close-icon">&times;</button>
              </div>
              <div className="modal-body">
                <img src={selectedRedeemed.img} alt={selectedRedeemed.name} className="modal-img" />
                <h3 className="modal-product-name">{selectedRedeemed.name}</h3>
                <div className="modal-info">
                  <p className="modal-code">Código: <span>{selectedRedeemed.code}</span></p>
                  <p className="modal-status">Status: <span className="status-pending">Resgate pendente</span></p>
                </div>
              </div>
              <div className="modal-buttons">
                <button onClick={handleOpenPopUp} className="redeem-button">Resgatar</button>
                <button onClick={() => setSelectedRedeemed(null)} className="close-button-redeemed">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {redeemedPopup && (
          <div className="modal-overlay" onClick={closeRedeemedPopup}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Produto Resgatado</h2>
                <button onClick={closeRedeemedPopup} className="modal-close-icon">&times;</button>
              </div>
              <div className="modal-body">
                <img src={redeemedPopup.img} alt={redeemedPopup.name} className="modal-img" />
                <h3 className="modal-product-name">{redeemedPopup.name}</h3>
                <div className="modal-info">
                  <p className="modal-code">Código: <span>{redeemedPopup.code}</span></p>
                  <p className="modal-status">Status: <span className="status-redeemed">Resgatado</span></p>
                </div>
              </div>
              <div className="modal-buttons">
                <button onClick={closeRedeemedPopup} className="close-button-redeemed">Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Redeemed;