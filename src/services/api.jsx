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

// pegar dados o user
export const getUserData = async () => {
  try {
    
    const response = await fetch(`${API_URL}/user/${localStorage.getItem("userId")}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`
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

// Função para editar os dados do usuário
export const editUserData = async (updatedData) => {
  try {
   
    const response = await fetch(`${API_URL}/user/${localStorage.getItem("userId")}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`
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

// pontos
export const updateUserPoints = async (product) => {
  const response = await fetch(`${API_URL}/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
               'Authorization': `${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      user: `${localStorage.getItem("userId")}`,
      product: product._id,
      points: (product.price * -1)
    }),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar pontos.', response);
  }
};

export const fetchProducts = async () => {
  try {
    
    const response = await fetch(`${API_URL}/product?`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`
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