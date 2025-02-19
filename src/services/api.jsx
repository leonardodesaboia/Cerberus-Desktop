export const API_URL = 'http://localhost:3000'; 

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao cadastrar usuário');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const loginUser = async (userData) => {
    const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
    }

    return data;
};

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

// pegar dados o user
export const getUserData = async () => {
  try {
    
    const response = await fetch(`${API_URL}/user/${localStorage.getItem("userId")}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }); 

    const data = await response.json();

    
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao obter os dados do usuário');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao obter os dados do usuário');
  }
};

// pontos
export const updateUserPoints = async (newPoints) => {
  const response = await fetch(`http://localhost:3000/user/67b36bb2f5f5a0d4dea71eb3`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points: newPoints }),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar pontos.');
  }
};

// Função para editar os dados do usuário
export const editUserData = async (updatedData) => {
  try {
   
     const response = await fetch(`${API_URL}/user/67b36bb2f5f5a0d4dea71eb3`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    console.log(JSON.stringify(updatedData))
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao editar os dados do usuário');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao editar os dados do usuário');
  }
};