import { useState, useEffect } from "react";
import NavBar from "../components/NavbarHome";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import CardPoints from "../components/CardPoints";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import "../styles/store.css";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [redeemedProducts, setRedeemedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userData = await getUserData();
        setPoints(userData.points);
        setRedeemedProducts(userData.log || []);
        // toast.info(`Bem-vindo à loja! Você tem ${userData.points} pontos disponíveis.`);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário", err);
        // toast.error("Não foi possível carregar seus dados");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        if (data.length > 0) {
          // toast.info(`${data.length} produtos disponíveis para resgate!`);
        } else {
          // toast.warning("Não há produtos disponíveis no momento.");
          return;
        }
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
        // toast.error("Falha ao carregar produtos");
      }
    };
    fetchData();
  }, []);

  // Handle point redemption
  const handleRedeemProduct = async () => {
    if (!selectedProduct) {
      // toast.error("Nenhum produto selecionado.");
      return;
    }
    
    const newPoints = points - selectedProduct.price;
    if (newPoints < 0) {
      toast.warning(`Pontos insuficientes para ${selectedProduct.name}. Você precisa de mais ${selectedProduct.price - points} pontos.`);
      return;
    }
    
    toast.info("Processando seu pedido...");
    
    try {
      await updateUserPoints(selectedProduct);
      const updatedUserData = await getUserData();
      
      toast.success(`${selectedProduct.name} resgatado com sucesso!.`);
      
      handleClosePopUp();
      
      setPoints(updatedUserData.points);
      setRedeemedProducts([...redeemedProducts, selectedProduct]);
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
      toast.error("Não foi possível resgatar o produto. Tente novamente mais tarde.");
    }
  };

  // Modal handlers
  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
    // toast.info(`Detalhes do produto: ${product.name}`);
  };

  const handleClosePopUp = () => {
    setSelectedProduct(null);
  };

  // Filter products by price ranges
  const lowPrice = products.filter((product) => product.isActive && product.price <= 5000);
  const midPrice = products.filter((product) => product.isActive && product.price > 5000 && product.price <= 10000);
  const midPrice2 = products.filter((product) => product.isActive && product.price > 10000 && product.price <= 20000);
  const highPrice = products.filter((product) => product.isActive && product.price > 20000);

  // Common Swiper settings
  const swiperSettings = {
    modules: [Navigation],
    spaceBetween: 25,
    slidesPerView: "auto",
    navigation: true,
    className: "products-swiper",
    breakpoints: {
      320: { slidesPerView: 1.2, spaceBetween: 15 },
      480: { slidesPerView: 2.2, spaceBetween: 20 },
      768: { slidesPerView: 3.2, spaceBetween: 25 },
      1024: { slidesPerView: 4.2, spaceBetween: 30 },
    }
  };

  // ProductCard component for DRY code
  const ProductCard = ({ product }) => (
    <div 
      className="product-card" 
      onClick={() => handleOpenPopUp(product)}
    >
      <div className="product-image-container">
        <img src={product.img} alt={product.name} className="product-image" />
      </div>
      <h4 className="product-name">{product.name}</h4>
      <p className="product-price">{product.price} pontos</p>
    </div>
  );

  // Category section component
  const CategorySection = ({ title, products }) => {
    if (products.length === 0) return null;
    
    return (
      <div className="category-section">
        <h3 className="category-title">{title}</h3>
        <div className="swiper-container">
          <Swiper {...swiperSettings}>
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
  };

  return (
    <div className="store-container">
      <NavBar />
      {/* ToastContainer deve ser incluído para renderizar os toasts */}
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
      <div className="store-content">
        <CardPoints points={points} />

        <section className="store-section">
          <h2 className="store-section-title">Loja de Pontos</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando produtos...</p>
            </div>
          ) : (
            <>
              <CategorySection title="Até 5000 Pontos" products={lowPrice} />
              <CategorySection title="5000 a 10000 Pontos" products={midPrice} />
              <CategorySection title="10000 a 20000 Pontos" products={midPrice2} />
              <CategorySection title="Acima de 20000 Pontos" products={highPrice} />
              
              {lowPrice.length === 0 && midPrice.length === 0 && highPrice.length === 0 && (
                <div className="no-products-message">
                  <p>Nenhum produto disponível no momento.</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Product redemption modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={handleClosePopUp}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedProduct.name}</h2>
            </div>
            
            <div className="modal-body">
              <img src={selectedProduct.img} alt={selectedProduct.name} className="modal-img" />
              <p className="modal-points">{selectedProduct.price} pontos</p>
              {points < selectedProduct.price && (
                <p className="insufficient-points">
                  Você precisa de mais {selectedProduct.price - points} pontos
                </p>
              )}
            </div>
            
            <div className="modal-buttons">
              <button 
                onClick={handleRedeemProduct} 
                className={`exchange-button ${points < selectedProduct.price ? 'disabled' : ''}`}
                disabled={points < selectedProduct.price}
              >
                Trocar
              </button>
              <button 
                onClick={() => {
                  handleClosePopUp();
                  // toast.info("Operação cancelada");
                }} 
                className="close-button"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
