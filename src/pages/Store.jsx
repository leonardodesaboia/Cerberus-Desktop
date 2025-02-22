import { useState, useEffect } from "react";
import NavBar from "../components/NavbarHome";
import { getUserData, updateUserPoints, fetchProducts } from "../services/api";
import "../styles/store.css";
// import PointsCard from "../components/PointsCard";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [points, setPoints] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null);
  

  // Carregar pontos
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userData = await getUserData();
          setPoints(userData.points);
        } catch (err) {
          setError("Erro ao carregar dados do usuário");
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);

// carregar produtos
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await fetchProducts();
            setProducts(data);
          } catch (error) {
            console.error("Erro ao carregar os produtos:", error);
            toast.error("Erro ao carregar os produtos.");
          }
        };
        fetchData();
      }, []);


 // Abrir popup dos produtos
  const handleOpenPopUp = (product) => {
    setSelectedProduct(product);
  };

  // Fechar popup dos produtos
  const  handleClosePopUp = () => {
    setSelectedProduct(null);
  };

  // Decrementar os pontos ao trocar por um produto
  const handlePoints = async () => {
    if (!selectedProduct) return;

    const newPoints = parseInt(points, 10) - selectedProduct.price;
    if (newPoints < 0) {
      toast.error("Pontos insuficientes para esta troca.");
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


  // seções de pontos
  const lowPrice = products.filter((product) => product.isActive && product.price <= 500);
  const midPrice = products.filter((product) => product.isActive && product.price > 1000 && product.price <= 5000);
  const highPrice = products.filter((product) => product.isActive && product.price > 5000);

  return (
    <div>
      <NavBar />
       <section>
       <div className="home-points-card">
              <p className="home-points-label">Seus pontos acumulados:</p>
              <p className="home-points-value animate-float">{points}</p>
              <img src="./coin.png" alt="" className="coin-points" />
            </div>
       </section>

      <section className="home-store-section">
        <h2 className="home-section-title">Loja de Pontos</h2>

        {lowPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Até 500 Pontos</h3>
            <div className="home-store-grid">
              {lowPrice.map((product) => (
                product.isActive && (
                    <div key={product._id} 
                      className="home-product-card"
                      onClick={() => handleOpenPopUp(product)}
                >
                  <img src={product.img} alt={product.name} className="home-product-image" />
                  <p className="home-product-pricee">{product.price} pontos</p>
                </div>
            )
        ))}
            </div>
        </div>
                
        )}

        {midPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">1000 a 5000 Pontos</h3>
            <div className="home-store-grid">
              {midPrice.map((product) => (
                <div key={product._id} className="home-product-card">
                  <img src={product.img} alt={product.name} className="home-product-image" />
                  <p className="home-product-pricee">{product.price} pontos</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {highPrice.length > 0 && (
          <div className="category-section">
            <h3 className="category-title">Acima de 5000 Pontos</h3>
            <div className="home-store-grid">
              {highPrice.map((product) => (
                <div key={product._id} className="home-product-card">
                  <img src={product.img} alt={product.name} className="home-product-image" />
                  <p className="store-product-name">{product.name}</p>
                  <p className="home-product-pricee">{product.price} pontos</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

            {/* Popup de troca de pontos */}
          {selectedProduct && (
            <div className="home-modal-overlay">
              <div className="home-modal-content">
                <img src={selectedProduct.img} alt={selectedProduct.name} className="home-modal-image" />
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.price} pontos</p>
                <button onClick={handleClosePopUp} className="home-close-button">
                  Fechar
                </button>
                <button onClick={handlePoints} className="home-exchange-button">
                  Trocar
                </button>
              </div>
            </div>
          )}

    </div>
  );
};

export default Store;
