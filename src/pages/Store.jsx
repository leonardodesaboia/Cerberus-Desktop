import { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavbarHome";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import CardPoints from "../components/CardPoints";
import { toast } from "react-toastify";
import "../styles/store.css";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [redeemedProducts, setRedeemedProducts] = useState([]);
  
  // Refs for the carousel containers
  const lowPriceCarouselRef = useRef(null);
  const midPriceCarouselRef = useRef(null);
  const highPriceCarouselRef = useRef(null);

  // Fetch user data
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

  // Fetch products
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

  // Handle points exchange
  const handlePoints = async () => {
    if (!selectedProduct) return;
    const newPoints = points - selectedProduct.price;
    if (newPoints < 0) {
      toast.warning("Pontos insuficientes");
      return;
    }
    
    try {
      await updateUserPoints(selectedProduct);
      
      // Reload user data after exchange
      const updatedUserData = await getUserData();
      
      handleClosePopUp();
      
      setPoints(updatedUserData.points);
      // Update redeemed products
      setRedeemedProducts([...redeemedProducts, selectedProduct]);
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
    }
  };

  // Modal handlers
  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePopUp = () => {
    setSelectedProduct(null);
  };

  // Carousel navigation function
  const scrollCarousel = (direction, carouselRef) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter products by price category
  const lowPrice = products.filter((product) => product.isActive && product.price <= 500);
  const midPrice = products.filter((product) => product.isActive && product.price > 1000 && product.price <= 5000);
  const highPrice = products.filter((product) => product.isActive && product.price > 5000);

  return (
    <div className="store-container">
      <NavBar />
      <CardPoints points={points} />

      <section className="store-section">
        <h2 className="store-section-title">Loja de Pontos</h2>

        {/* Low Price Category (Up to 500 points) */}
        {lowPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Até 500 Pontos</h3>
            <div className="carousel-wrapper">
              <button 
                className="carousel-arrow carousel-arrow-left" 
                onClick={() => scrollCarousel('left', lowPriceCarouselRef)}
                aria-label="Scroll left"
              >
                &lt;
              </button>
              
              <div className="carousel-container">
                <div className="carousel" ref={lowPriceCarouselRef}>
                  {lowPrice.map((product) => (
                    <div key={product._id} className="product-card" onClick={() => handleOpenPopUp(product)}>
                      <div className="product-image-container">
                        <img src={product.img} alt={product.name} className="product-image" />
                      </div>
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-price">{product.price} pontos</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="carousel-arrow carousel-arrow-right" 
                onClick={() => scrollCarousel('right', lowPriceCarouselRef)}
                aria-label="Scroll right"
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Mid Price Category (1000 to 5000 points) */}
        {midPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">1000 a 5000 Pontos</h3>
            <div className="carousel-wrapper">
              <button 
                className="carousel-arrow carousel-arrow-left" 
                onClick={() => scrollCarousel('left', midPriceCarouselRef)}
                aria-label="Scroll left"
              >
                &lt;
              </button>
              
              <div className="carousel-container">
                <div className="carousel" ref={midPriceCarouselRef}>
                  {midPrice.map((product) => (
                    <div key={product._id} className="product-card" onClick={() => handleOpenPopUp(product)}>
                      <div className="product-image-container">
                        <img src={product.img} alt={product.name} className="product-image" />
                      </div>
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-price">{product.price} pontos</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="carousel-arrow carousel-arrow-right" 
                onClick={() => scrollCarousel('right', midPriceCarouselRef)}
                aria-label="Scroll right"
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* High Price Category (Above 5000 points) */}
        {highPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Acima de 5000 Pontos</h3>
            <div className="carousel-wrapper">
              <button 
                className="carousel-arrow carousel-arrow-left" 
                onClick={() => scrollCarousel('left', highPriceCarouselRef)}
                aria-label="Scroll left"
              >
                &lt;
              </button>
              
              <div className="carousel-container">
                <div className="carousel" ref={highPriceCarouselRef}>
                  {highPrice.map((product) => (
                    <div key={product._id} className="product-card" onClick={() => handleOpenPopUp(product)}>
                      <div className="product-image-container">
                        <img src={product.img} alt={product.name} className="product-image" />
                      </div>
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-price">{product.price} pontos</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="carousel-arrow carousel-arrow-right" 
                onClick={() => scrollCarousel('right', highPriceCarouselRef)}
                aria-label="Scroll right"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Product Exchange Modal */}
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