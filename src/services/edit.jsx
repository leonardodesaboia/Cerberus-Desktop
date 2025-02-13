// api.js

export const API_URL = 'http://localhost:3000';

// Função para pegar os dados do usuário
export const getUserData = async () => {
  try {
    const userId = localStorage.getItem('userId');  // Supondo que o ID do usuário esteja no localStorage
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    const response = await fetch(`${API_URL}/user/${userId}`, {
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

// Função para editar os dados do usuário
export const editUserData = async (updatedData) => {
  try {
    const userId = localStorage.getItem('userId');  // Supondo que o ID do usuário esteja no localStorage
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    const response = await fetch(`${API_URL}/user/${userId}`, {
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
