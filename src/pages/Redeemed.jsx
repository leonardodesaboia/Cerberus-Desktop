import { useState, useEffect } from 'react';
import Navbar from '../components/NavbarHome';
import { fetchProductsRedeemed, fetchProductsNotRedeemed, fetchProducts, updateLog } from "../services/api";
import CardPoints from '../components/CardPoints';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import "../styles/store.css";
import '../styles/redeemed.css';

const Redeemed = () => {
  const [redeemedLogs, setRedeemedLogs] = useState([]);
  const [notRedeemedLogs, setNotRedeemedLogs] = useState([]);
  const [selectedRedeemed, setSelectedRedeemed] = useState(null);
  const [redeemedPopup, setRedeemedPopup] = useState(null); 
  const [products, setProducts] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Load redeemed and not redeemed products along with product details
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        toast.info("Carregando seus produtos...");
        
        const [redeemedData, notRedeemedData, productsData] = await Promise.all([
          fetchProductsRedeemed(),
          fetchProductsNotRedeemed(),
          fetchProducts()
        ]);
        
        // Create a map of products by ID for easy lookup
        const prodMap = {};
        productsData.forEach((product) => {
          prodMap[product._id] = product;
        });
        
        setProductMap(prodMap);
        setRedeemedLogs(redeemedData);
        setNotRedeemedLogs(notRedeemedData);
        setProducts(productsData);

        toast.success("Dados carregados com sucesso!");
        
        if (notRedeemedData.length > 0) {
          toast.info(`Você tem ${notRedeemedData.length} produto(s) pendente(s) para resgate.`);
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Falha ao carregar seus produtos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  // Update log when a product is redeemed
  useEffect(() => {
    const updateLogData = async () => {
      if (selectedRedeemed) {
        try {
          await updateLog(selectedRedeemed);
        } catch (error) {
          console.error("Erro ao atualizar log:", error);
          toast.error("Falha ao atualizar status do produto.");
        }
      }
    };
    
    updateLogData();
  }, [selectedRedeemed]);

  // Handle selecting a product to be redeemed
  const handleRedeemed = (log) => {
    setSelectedRedeemed(log);
    const product = getProductDetails(log);
    toast.info(`Visualizando detalhes de: ${product.name}`);
  };

  // Handle redeeming a product
  const handleRedeemedProd = async () => {
    if (!selectedRedeemed) return;
    
    try {
      toast.info("Processando seu resgate...");
      
      const productDetails = getProductDetails(selectedRedeemed);
      
      setNotRedeemedLogs(notRedeemedLogs.filter(log => log._id !== selectedRedeemed._id));
      setRedeemedLogs([...redeemedLogs, selectedRedeemed]);
      setRedeemedPopup(selectedRedeemed);
      setSelectedRedeemed(null);
      
      toast.success(`${productDetails.name} foi resgatado com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
      toast.error("Não foi possível concluir o resgate. Tente novamente.");
    }
  };

  const handleOpenPopUp = () => {
    handleRedeemedProd();
  };

  const handleShowRedeemedPopUp = (log) => {
    setRedeemedPopup(log);
    const product = getProductDetails(log);
    toast.info(`Visualizando detalhes do produto resgatado: ${product.name}`);
  };

  const closeRedeemedPopup = () => {
    setRedeemedPopup(null);
    toast.info("Janela de detalhes fechada");
  };

  // Get product details from a log
  const getProductDetails = (log) => {
    if (!log || !log.product || !productMap[log.product]) {
      return { name: "Produto desconhecido", img: "/placeholder-image.jpg" };
    }
    return productMap[log.product];
  };

  // Swiper breakpoints
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

  const handleCancelRedemption = () => {
    setSelectedRedeemed(null);
    toast.info("Resgate cancelado pelo usuário");
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="redeemed-content">
        <CardPoints />
        
        <div className="category-section">
          <h3 className="category-title">Resgates Pendentes</h3>
          {notRedeemedLogs.length === 0 ? (
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
                onSwiper={(swiper) => {
                  if (notRedeemedLogs.length > 1) {
                    toast.info("Deslize para ver mais produtos pendentes");
                  }
                }}
                className="swiper-container">
                {notRedeemedLogs.map((log) => {
                  const product = getProductDetails(log);
                  return (
                    <SwiperSlide key={log._id}>
                      <div className="product-card-no-redeemed">
                        <div className="product-image-container">
                          <img src={product.img} alt={product.name || "Produto a resgatar"} className="product-image" />
                        </div>
                        <h4 className="product-name">{product.name}</h4>
                        <button 
                          onClick={() => handleRedeemed(log)} 
                          className="see-button"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </SwiperSlide>
                  );
                })}
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
          {redeemedLogs.length === 0 ? (
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
                onSwiper={(swiper) => {
                  if (redeemedLogs.length > 1) {
                    toast.info("Deslize para ver todos os produtos resgatados");
                  }
                }}
                className="swiper-container">
                {redeemedLogs.map((log) => {
                  const product = getProductDetails(log);
                  return (
                    <SwiperSlide key={log._id}>
                      <div className="product-card">
                        <div className="product-image-container">
                          <img src={product.img} alt={product.name || "Produto resgatado"} className="product-image" />
                        </div>
                        <h4 className="product-name">{product.name}</h4>
                        <button 
                          onClick={() => handleShowRedeemedPopUp(log)} 
                          className="see-button"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className="swiper-navigation-custom">
                <div className="swiper-button-prev-custom-redeemed"></div>
                <div className="swiper-button-next-custom-redeemed"></div>
              </div>
            </div>
          )}
        </div>

        {/* Popup for product to be redeemed */}
        {selectedRedeemed && (
          <div className="modal-overlay" onClick={handleCancelRedemption}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Detalhes do Produto</h2>
                <button onClick={handleCancelRedemption} className="modal-close-icon">&times;</button>
              </div>
              <div className="modal-body">
                <img 
                  src={getProductDetails(selectedRedeemed).img} 
                  alt={getProductDetails(selectedRedeemed).name} 
                  className="modal-img" 
                />
                <h3 className="modal-product-name">{getProductDetails(selectedRedeemed).name}</h3>
                <div className="modal-info">
                  <p className="modal-code">Código: <span>{getProductDetails(selectedRedeemed).code}</span></p>
                  <p className="modal-status">Status: <span className="status-pending">Resgate pendente</span></p>
                </div>
              </div>
              <div className="modal-buttons">
                <button 
                  onClick={handleOpenPopUp} 
                  className="redeem-button"
                >
                  Resgatar
                </button>
                <button 
                  onClick={handleCancelRedemption} 
                  className="close-button-redeemed"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup for redeemed product */}
        {redeemedPopup && (
          <div className="modal-overlay" onClick={closeRedeemedPopup}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Produto Resgatado</h2>
                <button onClick={closeRedeemedPopup} className="modal-close-icon">&times;</button>
              </div>
              <div className="modal-body">
                <img 
                  src={getProductDetails(redeemedPopup).img} 
                  alt={getProductDetails(redeemedPopup).name} 
                  className="modal-img" 
                />
                <h3 className="modal-product-name">{getProductDetails(redeemedPopup).name}</h3>
                <div className="modal-info">
                  <p className="modal-code">Código: <span>{getProductDetails(redeemedPopup).code}</span></p>
                  <p className="modal-status">Status: <span className="status-redeemed">Resgatado</span></p>
                </div>
              </div>
              <div className="modal-buttons">
                <button 
                  onClick={() => {
                    closeRedeemedPopup();
                    navigator.clipboard.writeText(getProductDetails(redeemedPopup).code);
                    toast.success("Código copiado para a área de transferência!");
                  }} 
                  className="copy-button"
                >
                  Copiar Código
                </button>
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