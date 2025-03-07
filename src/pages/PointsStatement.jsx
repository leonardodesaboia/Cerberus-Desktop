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
  
  // Função melhorada para analisar datas em vários formatos
  const parseFlexibleDate = (dateString) => {
    if (!dateString) return new Date(0); // Retorna data mínima se for undefined
    
    try {
      // Primeiro tenta o formato ISO diretamente
      const isoDate = new Date(dateString);
      if (!isNaN(isoDate.getTime())) return isoDate;
      
      // Tenta formato DD/MM/YYYY
      if (dateString.includes('/')) {
        const parts = dateString.split(', ');
        const datePart = parts[0].split('/');
        
        if (datePart.length !== 3) throw new Error('Formato de data inválido');
        
        const day = parseInt(datePart[0], 10);
        const month = parseInt(datePart[1], 10) - 1;  // Meses em JS são baseados em 0
        const year = parseInt(datePart[2], 10);
        
        // Se houver parte de tempo
        if (parts.length > 1) {
          const timePart = parts[1].split(':');
          const hour = parseInt(timePart[0], 10);
          const minute = parseInt(timePart[1], 10);
          const second = timePart.length > 2 ? parseInt(timePart[2], 10) : 0;
          
          return new Date(year, month, day, hour, minute, second);
        } else {
          return new Date(year, month, day);
        }
      }
      
      // Se chegou aqui, não conseguiu analisar a data
      throw new Error(`Não foi possível analisar o formato de data: ${dateString}`);
    } catch (error) {
      console.warn(`Erro ao analisar data "${dateString}":`, error);
      return new Date(0); // Retorna data mínima em caso de erro
    }
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
      
      // Estratégia de ordenação melhorada
      const sortedLogs = [...data].sort((a, b) => {
        // Se ambos tiverem timestamps (createdAt)
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        
        // Se ambos tiverem activityDate
        if (a.activityDate && b.activityDate) {
          const dateA = parseFlexibleDate(a.activityDate);
          const dateB = parseFlexibleDate(b.activityDate);
          return dateB - dateA;
        }
        
        // Fallback para IDs (assumindo que IDs mais recentes são maiores)
        if (a._id && b._id) {
          return b._id.localeCompare(a._id);
        }
        
        return 0; // Sem critério de ordenação
      });
      
      // Log das datas ordenadas para verificação
      console.log("Datas após ordenação:", sortedLogs.map(log => ({
        id: log._id,
        date: log.activityDate,
        parsedDate: log.activityDate ? parseFlexibleDate(log.activityDate).toISOString() : 'N/A'
      })));
      
      setTransactions(sortedLogs);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
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
        return dateString || 'Data desconhecida';
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
      return dateString || 'Data desconhecida';
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
        {/* <button className="refresh-button" onClick={fetchAllLogs}>
          <FaRedo />
        </button> */}
      </header>
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message-statement">
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