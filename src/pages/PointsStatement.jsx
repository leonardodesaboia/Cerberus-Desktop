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
  
  // Função para analisar datas em vários formatos
  const parseFlexibleDate = (dateString) => {
    // Se dateString contém '/', assume que está no formato DD/MM/YYYY (Brasileiro)
    if (dateString.includes('/')) {
      const parts = dateString.split(', ');
      const datePart = parts[0].split('/');
      
      const day = parseInt(datePart[0]);
      const month = parseInt(datePart[1]) - 1;  // Meses em JS são baseados em 0
      const year = parseInt(datePart[2]);
      
      // Se houver parte de tempo
      if (parts.length > 1) {
        const timePart = parts[1].split(':');
        const hour = parseInt(timePart[0]);
        const minute = parseInt(timePart[1]);
        const second = timePart.length > 2 ? parseInt(timePart[2]) : 0;
        
        return new Date(year, month, day, hour, minute, second);
      } else {
        return new Date(year, month, day);
      }
    } 
    
    // Padrão para formato ISO
    return new Date(dateString);
  };
  
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
      
      // Log das datas brutas para depuração
      console.log("Datas brutas antes da ordenação:", data.map(log => ({
        id: log._id,
        date: log.activityDate
      })));
      
      // Ordena por data exata (mais recente primeiro)
      const sortedLogs = [...data].sort((a, b) => {
        try {
          // Analisa datas com a função auxiliar
          const dateA = parseFlexibleDate(a.activityDate);
          const dateB = parseFlexibleDate(b.activityDate);
          
          // Verifica se as datas são válidas
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            throw new Error('Análise de data inválida');
          }
          
          // Ordena por timestamp (mais recente primeiro)
          return dateB.getTime() - dateA.getTime();
        } catch (error) {
          console.warn('Erro ao analisar datas, voltando para comparação de strings:', error);
          
          // Fallback para comparação básica de strings
          return b.activityDate.localeCompare(a.activityDate);
        }
      });
      
      // Log das datas ordenadas para verificação
      console.log("Datas após ordenação:", sortedLogs.map(log => ({
        id: log._id,
        date: log.activityDate,
        parsedDate: parseFlexibleDate(log.activityDate).toISOString()
      })));
      
      setTransactions(sortedLogs);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Erro ao conectar com o servidor');
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    try {
      // Usa a mesma lógica de análise para consistência
      const date = parseFlexibleDate(dateString);
      
      if (isNaN(date.getTime())) {
        // Se não for uma data válida, mostra a string como está
        return dateString;
      }
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      // Volta para mostrar a string original
      return dateString;
    }
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