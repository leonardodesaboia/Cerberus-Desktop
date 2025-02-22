import { useState, useEffect } from "react";
import NavBar from "../components/NavbarHome";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import "../styles/store.css";
import CardPoints from "../components/CardPoints";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setPoints(userData.points);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário");
      }
    };
    fetchUserData();
  }, []);

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

  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePopUp = () => {
    setSelectedProduct(null);
  };

  const handlePoints = async () => {
    if (!selectedProduct) return;
    const newPoints = points - selectedProduct.price;
    if (newPoints < 0) {
      alert("Pontos insuficientes para esta troca.");
      return;
    }
    try {
      await updateUserPoints(selectedProduct);
      setPoints(newPoints);
      handleClosePopUp();
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
    }
  };

  const lowPrice = products.filter((product) => product.isActive && product.price <= 500);
  const midPrice = products.filter((product) => product.isActive && product.price > 1000 && product.price <= 5000);
  const highPrice = products.filter((product) => product.isActive && product.price > 5000);

  return (
    <div className="store-container">
      <NavBar />
      <CardPoints/>

      <section className="home-store-section">
        <h2 className="home-section-title">Loja de Pontos</h2>

{/* ate 500 pontos */}
        {lowPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Até 500 Pontos</h3>
            <div className="carousel-container">
              <div className="carousel">
                {lowPrice.map((product) => (
                  <div key={product._id} className="home-product-card" onClick={() => handleOpenPopUp(product)}>
                    <img src={product.img} alt={product.name} className="home-product-image" />
                    <p>{product.name}</p>
                    <p className="home-product-pricee">{product.price} pontos</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

{/* acima de 1000 ate 5000 pontos */}
        {midPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">1000 a 5000 Pontos</h3>
            <div className="carousel-container">
              <div className="carousel">
                {midPrice.map((product) => (
                  <div key={product._id} className="home-product-card" onClick={() => handleOpenPopUp(product)}>
                    <img src={product.img} alt={product.name} className="home-product-image" />
                    <p>{product.name}</p>
                    <p className="home-product-pricee">{product.price} pontos</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
{/* acima de 5000 pontos  */}
        {highPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Acima de 5000 Pontos</h3>
            <div className="carousel-container">
              <div className="carousel">
                {highPrice.map((product) => (
                  <div key={product._id} className="home-product-card" onClick={() => handleOpenPopUp(product)}>
                    <img src={product.img} alt={product.name} className="home-product-image" />
                    <p>{product.name}</p>
                    <p className="home-product-pricee">{product.price} pontos</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

{/* modal de troca de pontos */}
      {selectedProduct && (
        <div className="home-modal-overlay">
          <div className="home-modal-content">
            <img src={selectedProduct.img} alt={selectedProduct.name} className="home-modal-image" />
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.price} pontos</p>
            <button onClick={handleClosePopUp} className="home-close-button">Fechar</button>
            <button onClick={handlePoints} className="home-exchange-button">Trocar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
