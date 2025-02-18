
export const API_URL = 'http://localhost:3000';

export const getUserData = async () => {
  try {
    
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }); 

    const data = await response.json();
    console.log(data)
    console.log(data.paperDiscarted)
    console.log(data.metalDiscarted)
    console.log(data.username)

    
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao obter os dados do usuário');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao obter os dados do usuário');
  }
};



// pontos
export const updatePoints = async () => {
  try {
    //67b36bb2f5f5a0d4dea71eb3
    const response = await fetch(`${API_URL}/log`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({points: newPoints})
    }); 

    const data = await response.json();
    console.log(data.points)

    
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao obter os pontos do usuário');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao obter os pontos do usuário');
  }
};


// Função para editar os dados do usuário
export const editUserData = async (updatedData) => {
  try {
   
     const response = await fetch(`${API_URL}/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao editar os dados do usuário');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao editar os dados do usuário');
  }
};
