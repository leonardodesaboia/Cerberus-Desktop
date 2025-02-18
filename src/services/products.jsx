export const API_URL = 'http://localhost:3000'; 

export const products = async (userData) => {
  try {
    // Convertendo o objeto userData para query string
    const queryString = new URLSearchParams(userData).toString();
    
    const response = await fetch(`${API_URL}/product?`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao obter produtos');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao obter produtos');
  }
};



