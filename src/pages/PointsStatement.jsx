import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaRedo } from 'react-icons/fa';
import NavBar from '../components/NavbarHome';
import '../styles/pointsStatements.css';

const Extrato = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    fetchAllLogs();
  }, []);
  
  const API_URL = 'http://localhost:3000';
  
  const fetchAllLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/log/${localStorage.getItem("userId")}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados de transações.');
      }
      
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Erro ao conectar com o servidor');
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getTransactionDescription = (transaction) => {
    if (transaction.product) {
      const productName = typeof transaction.product === 'object'
        ? transaction.product.name
        : 'Produto';
      return `Resgate: ${productName}`;
    } else if (transaction.plasticDiscarted > 0) {
      return `Descarte de ${transaction.plasticDiscarted} plásticos`;
    } else if (transaction.metalDiscarted > 0) {
      return `Descarte de ${transaction.metalDiscarted} metais`;
    } else if (transaction.points > 0) {
      return "Entrada de pontos";
    } else {
      return "Saída de pontos";
    }
  };
  
  return (
    <div className="extrato-container">
      <NavBar/>
      <header className="extrato-header">
        <h1>Extrato de Pontos</h1>
        <button className="refresh-button" onClick={fetchAllLogs}>
          <FaRedo />
        </button>
      </header>
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchAllLogs}>Tentar novamente</button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não possui movimentações de pontos.</p>
        </div>
      ) : (
        <div className="transactions">
          <h3>Histórico de Transações</h3>
          
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className={`transaction-item ${transaction.points >= 0 ? 'positive' : 'negative'}`}
            >
              <div className="transaction-icon">
                {transaction.points >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              </div>
              
              <div className="transaction-info">
                <div className="transaction-description">
                  {getTransactionDescription(transaction)}
                </div>
                <div className="transaction-date">
                  {formatDate(transaction.activityDate)}
                </div>
              </div>
              
              <div className="transaction-points">
                {transaction.points >= 0 ? '+' : ''}{transaction.points} pts
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Extrato;