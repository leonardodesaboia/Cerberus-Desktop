import { useState, useEffect } from "react";
import NavBar from "../components/NavbarHome";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import "../styles/store.css";
import CardPoints from "../components/CardPoints";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [redeemedProducts, setRedeemedProducts] = useState([]);
  const [selectedRedeemed, setSelectedRedeemed] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setPoints(userData.points);
        setRedeemedProducts(userData.redeemed|| []);
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
      setRedeemedProducts([...redeemedProducts, selectedProduct]);
      handleClosePopUp();
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
    }
  };

  const handleRedeemed=()=>{
    setSelectedRedeemed(true)
  }

  const lowPrice = products.filter((product) => product.isActive && product.price <= 500);
  const midPrice = products.filter((product) => product.isActive && product.price > 1000 && product.price <= 5000);
  const highPrice = products.filter((product) => product.isActive && product.price > 5000);

  return (
    <div className="store-container">
      <NavBar />
      <CardPoints />

        {redeemedProducts.length >= 0 && (
          <div className="category-section">
            <h3 className="category-title">Meus Resgates</h3>
            <div className="carousel-container">
              <div className="carousel">
                {redeemedProducts.map((product) => (
                  <div key={product._id} className="store-product-card">
                    <div>
                    <img src={product.img} alt="" className="store-product-image" />
                    </div>
                    <button className="store-product-redeemed">Resgatar</button>
                  </div>
                ))}
              </div>
            </div>
          </div>



        )}

        



      <section className="store-store-section">
        <h2 className="store-section-title">Loja de Pontos</h2>


        {/* até 500 pontos */}
        {lowPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Até 500 Pontos</h3>
            <div className="carousel-container">
              <div className="carousel">
                {lowPrice.map((product) => (
                  <div key={product._id} className="store-product-card" onClick={() => handleOpenPopUp(product)}>
                    <img src={product.img} alt={product.name} className="store-product-image" />
                    <p>{product.name}</p>
                    <p className="store-product-price">{product.price} pontos</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* acima de 1000 até 5000 pontos */}
        {midPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">1000 a 5000 Pontos</h3>
            <div className="carousel-container">
              <div className="carousel">
                {midPrice.map((product) => (
                  <div key={product._id} className="store-product-card" onClick={() => handleOpenPopUp(product)}>
                    <img src={product.img} alt={product.name} className="store-product-image" />
                    <p>{product.name}</p>
                    <p className="store-product-price">{product.price} pontos</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* acima de 5000 pontos */}
        {highPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Acima de 5000 Pontos</h3>
            <div className="carousel-container">
              <div className="carousel">
                {highPrice.map((product) => (
                  <div key={product._id} className="store-product-card" onClick={() => handleOpenPopUp(product)}>
                    <img src={product.img} alt={product.name} className="store-product-image" />
                    <p>{product.name}</p>
                    <p className="store-product-price">{product.price} pontos</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* modal de troca de pontos */}
      {selectedProduct && (
        <div className="store-modal-overlay">
          <div className="store-modal-content">
            <img src={selectedProduct.img} alt={selectedProduct.name} className="store-modal-image" />
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.price} pontos</p>
            <button onClick={handleClosePopUp} className="store-close-button">Fechar</button>
            <button onClick={handlePoints} className="store-exchange-button">Trocar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;