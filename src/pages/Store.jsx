
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

  // pegar dados do usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setPoints(userData.points);
        setRedeemedProducts(userData.log || []);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário");
      }
    };
    fetchUserData();
  }, []);

  // pegar produtos
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

  // decrementar pontos
  const handlePoints = async () => {
    if (!selectedProduct) return;
    const newPoints = points - selectedProduct.price;
    if (newPoints < 0) {
      toast.warning("Pontos insuficientes");
      return;
    }
    
    try {
      await updateUserPoints(selectedProduct);
      
    
      const updatedUserData = await getUserData();
      
      handleClosePopUp();
      
      setPoints(updatedUserData.points);
      // Update redeemed products
      setRedeemedProducts([...redeemedProducts, selectedProduct]);
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
    }
  };

  //modais
  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePopUp = () => {
    setSelectedProduct(null);
  };

  // Filtrar produtos
  const lowPrice = products.filter((product) => product.isActive && product.price <= 500);
  const midPrice = products.filter((product) => product.isActive && product.price > 1000 && product.price <= 5000);
  const highPrice = products.filter((product) => product.isActive && product.price > 5000);

  return (
    <div className="store-container">
      <NavBar />
      <CardPoints points={points} />

      <section className="store-section">
        <h2 className="store-section-title">Loja de Pontos</h2>

        {/* ate 500 pontos */}
        {lowPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Até 500 Pontos</h3>
            <div className="swiper-container">
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView="auto"
                navigation
                className="products-swiper"
                breakpoints={{
                  320: {
                    slidesPerView: 1.2,
                    spaceBetween: 10,
                  },
                  480: {
                    slidesPerView: 2.2,
                    spaceBetween: 15,
                  },
                  768: {
                    slidesPerView: 3.2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 4.2,
                    spaceBetween: 20,
                  },
                }}
              >
                {lowPrice.map((product) => (
                  <SwiperSlide key={product._id}>
                    <div className="product-card" onClick={() => handleOpenPopUp(product)}>
                      <div className="product-image-container">
                        <img src={product.img} alt={product.name} className="product-image" />
                      </div>
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-price">{product.price} pontos</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
{/* ate 5000 pontos */}
        {midPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">1000 a 5000 Pontos</h3>
            <div className="swiper-container">
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView="auto"
                navigation
                className="products-swiper"
                breakpoints={{
                  320: {
                    slidesPerView: 1.2,
                    spaceBetween: 10,
                  },
                  480: {
                    slidesPerView: 2.2,
                    spaceBetween: 15,
                  },
                  768: {
                    slidesPerView: 3.2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 4.2,
                    spaceBetween: 20,
                  },
                }}
              >
                {midPrice.map((product) => (
                  <SwiperSlide key={product._id}>
                    <div className="product-card" onClick={() => handleOpenPopUp(product)}>
                      <div className="product-image-container">
                        <img src={product.img} alt={product.name} className="product-image" />
                      </div>
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-price">{product.price} pontos</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {/*cima de 5000pontos*/}
        {highPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Acima de 5000 Pontos</h3>
            <div className="swiper-container">
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView="auto"
                navigation
                className="products-swiper"
                breakpoints={{
                  320: {
                    slidesPerView: 1.2,
                    spaceBetween: 10,
                  },
                  480: {
                    slidesPerView: 2.2,
                    spaceBetween: 15,
                  },
                  768: {
                    slidesPerView: 3.2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 4.2,
                    spaceBetween: 20,
                  },
                }}
              >
                {highPrice.map((product) => (
                  <SwiperSlide key={product._id}>
                    <div className="product-card" onClick={() => handleOpenPopUp(product)}>
                      <div className="product-image-container">
                        <img src={product.img} alt={product.name} className="product-image" />
                      </div>
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-price">{product.price} pontos</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </section>

      {/*modal de troca*/}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img src={selectedProduct.img} alt={selectedProduct.name} className="modal-img" />
            <h2>{selectedProduct.name}</h2>
            <p className="modal-points">{selectedProduct.price} pontos</p>
            <div className="modal-buttons">
              <button onClick={handlePoints} className="exchange-button">Trocar</button>
              <button onClick={handleClosePopUp} className="close-button">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;