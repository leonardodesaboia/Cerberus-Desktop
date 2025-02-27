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
  const [products, setProducts] = useState()
  const [redeemedLog, setRedeemedLog] = useState([]);

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

  const handleRedeemed = (product) => {
    setSelectedRedeemed(product);
  };

  const handleRedeemedProd = async () => {
    if (!selectedRedeemed) return;
    
    try {
      setNotRedeemedProducts(notRedeemedProducts.filter(prod => prod._id !== selectedRedeemed._id));
      setRedeemedProducts([...redeemedProducts, selectedRedeemed]);
      setRedeemedPopup(selectedRedeemed); // Set the redeemed popup with the product data
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

  //pegar produtos p pegar a img
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchProducts();
          setProducts(data);
        } catch (error) {
          console.error("Erro ao carregar os produtos:", error);
        }
      };
      fetchData();
    }, []);

  return (
    <div className="redeemed-container">
      <Navbar />
      <CardPoints />
      
      <div className="category-section">
        <h3 className="category-title">Resgates Pendentes</h3>
        {notRedeemedProducts.length === 0 ? (
          <p className="no-redeemed-message">Você ainda não resgatou nenhum produto.</p>
        ) : (
          <Swiper 
            spaceBetween={50}
            slidesPerView={4}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            navigation 
            modules={[Navigation]} 
            className="swiper-container">
            {notRedeemedProducts.map((product) => (
              <SwiperSlide key={product._id} className="product-card-no-redeemed">
                <div className="product-image-container">
                  <img src={product.img} alt="produto a resgatar" className="product-image" />
                </div>
                <button onClick={() => handleRedeemed(product)} className="see-button">
                  Ver
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="category-section">
        <h3 className="category-title">Produtos Resgatados</h3>
        {redeemedProducts.length === 0 ? (
          <p className="no-redeemed-message">Você ainda não resgatou nenhum produto.</p>
        ) : (
          <Swiper 
            spaceBetween={50}
            slidesPerView={4}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            navigation 
            modules={[Navigation]} 
            className="swiper-container">
            {redeemedProducts.map((product) => (
              <SwiperSlide key={product._id} className="product-card">
                <div className="product-image-container">
                  <img src={product.img} alt="produto resgatado" className="product-image" />
                </div>
                <button onClick={() => handleShowRedeemedPopUp(product)}>Ver</button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {selectedRedeemed && (
          <div className="modal-overlay">
            <div className="modal-content">
              <img src={selectedRedeemed.img} alt={selectedRedeemed.name} className="modal-img" />
              <h2>{selectedRedeemed.name}</h2>
              <p>Código: {selectedRedeemed.code}</p>
              <p>Status: resgate pendente.</p>
              <div className="modal-buttons">
                <button onClick={handleOpenPopUp} className="redeem-button">Resgatar</button>
                <button onClick={() => setSelectedRedeemed(null)} className="close-button-redeemed">Fechar</button>
              </div>
            </div>
          </div>
        )}

        {redeemedPopup && (
          <div className="modal-overlay">
            <div className="modal-content">
              <img src={redeemedPopup.img} alt={redeemedPopup.name} className="modal-img" />
              <h2>{redeemedPopup.name}</h2>
              <p>Código: {redeemedPopup.code}</p>
              <p>Status: resgatado.</p>
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