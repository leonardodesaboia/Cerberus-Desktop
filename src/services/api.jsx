export const API_URL = 'http://localhost:3000'; 
export const API_PASS_URL ='http://localhost:5173'

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao cadastrar usuário');
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao fazer login');
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const getUserData = async () => {
  try {
    const response = await fetch(`${API_URL}/user/${localStorage.getItem("userId")}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao obter os dados do usuário');
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const editUserData = async (updatedData) => {
  try {
    const response = await fetch(`${API_URL}/user/${localStorage.getItem("userId")}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao editar os dados do usuário');
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const updateUserPoints = async (product) => {
  try {
    const response = await fetch(`${API_URL}/log/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        user: localStorage.getItem("userId"),
        product: product._id,
        points: product.price * -1,
      }),
    });
    
    if (!response.ok) throw new Error('Erro ao atualizar pontos.');
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/product`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao obter produtos');
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const fetchProductsRedeemed = async () => {
  try {
    const response = await fetch(`${API_URL}/log/redeemed/${localStorage.getItem("userId")}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao obter produtos resgatados');
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const fetchProductsNotRedeemed = async () => {
  try {
    const response = await fetch(`${API_URL}/log/not/redeemed/${localStorage.getItem("userId")}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao obter produtos não resgatados');
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};


export const updateLog = async (log) => {
  try {
    const response = await fetch(`${API_URL}/log/${log._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("token")}`,
      },
     
    });
    
    if (!response.ok) throw new Error('Erro ao atualizar pontos.');
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const emailResetPassword = async (token, password) => {
  const response = await fetch(`${API_PASS_URL}/ResetPassword/${token}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }) // Enviando a nova senha
  });
  console.log(token)
  const data = await response.json();

  if (!response.ok) {
      throw new Error(data.message || 'Erro ao redefinir a senha');
  }

  return data; 
};

export const resetPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/user/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao solicitar redefinição de senha');
      }
      
      return {
        message: data.message || 'Email de recuperação enviado. Por favor, verifique sua caixa de entrada.'
      };
    } else {
     
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Reset password error:", error);
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};
