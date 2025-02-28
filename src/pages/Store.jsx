import { useState, useEffect } from "react";
import NavBar from "../components/NavbarHome";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import CardPoints from "../components/CardPoints";
import { toast } from "react-toastify";
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
      } catch (err) {
        console.error("Erro ao carregar dados do usuário", err);
        toast.error("Não foi possível carregar seus dados");
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
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
        toast.error("Falha ao carregar produtos");
      }
    };
    fetchData();
  }, []);

  // Handle point redemption
  const handleRedeemProduct = async () => {
    if (!selectedProduct) return;
    
    const newPoints = points - selectedProduct.price;
    if (newPoints < 0) {
      toast.warning("Pontos insuficientes para este produto");
      return;
    }
    
    try {
      await updateUserPoints(selectedProduct);
      const updatedUserData = await getUserData();
      
      toast.success(`Você resgatou ${selectedProduct.name} com sucesso!`);
      handleClosePopUp();
      
      setPoints(updatedUserData.points);
      setRedeemedProducts([...redeemedProducts, selectedProduct]);
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
      toast.error("Não foi possível resgatar o produto");
    }
  };

  // Modal handlers
  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePopUp = () => {
    setSelectedProduct(null);
  };

  // Filter products by price ranges
  const lowPrice = products.filter((product) => product.isActive && product.price <= 500);
  const midPrice = products.filter((product) => product.isActive && product.price > 1000 && product.price <= 5000);
  const highPrice = products.filter((product) => product.isActive && product.price > 5000);

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
    <div className="product-card" onClick={() => handleOpenPopUp(product)}>
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
              <CategorySection title="Até 500 Pontos" products={lowPrice} />
              <CategorySection title="1000 a 5000 Pontos" products={midPrice} />
              <CategorySection title="Acima de 5000 Pontos" products={highPrice} />
              
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
              <button onClick={handleClosePopUp} className="close-button">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;