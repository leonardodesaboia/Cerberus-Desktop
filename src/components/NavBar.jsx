import React, { useState, useEffect } from 'react';
import './navbar.css';
import { isValidEmail } from '../validations/MailValidation';
import { getUserData, editUserData } from '../services/edit';  // Importa as funções de API

const NavBar = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
    setIsEditOpen(false);
  };

  const toggleEditMenu = () => {
    setIsEditOpen(!isEditOpen);
  };

  const handleLogout = () => {
    alert("Saiu");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar a conta?");
    if (confirmDelete) {
      alert("Conta excluída!");
    }
  };

  const handleSaveChanges = async () => {
    const updates = {};

    if (userName.trim() !== "") {
      updates.userName = userName;
    }

    if (newEmail.trim()) {
      if (!isValidEmail(currentEmail, newEmail, originalEmail)) {
        return;
      }
      updates.email = newEmail;
    }

    if (Object.keys(updates).length === 0) {
      alert("Nenhuma alteração foi feita.");
      return;
    }

    try {
      const updatedUser = await editUserData(updates);  // Chama a função para editar os dados
      setUserName(updatedUser.userName);
      setOriginalEmail(updatedUser.email); // Atualiza o email original
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert(error.message);
    }
    setIsEditOpen(false);
  };

  // Função para carregar os dados do usuário ao montar o componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData(); // Chama a função para buscar os dados
        setUserName(userData.userName);
        setCurrentEmail(userData.email);
        setOriginalEmail(userData.email);
      } catch (error) {
        alert(error.message);
      }
    };

    loadUserData();
  }, []);



  
  return (
    <nav className="navbar">
      <div className="brand">
        <h1>Cerberus</h1>
      </div>
      <div className="welcome">
        <span className="welcome-text">Bem-vindo,</span>
        <h2 className="user-name">{userName}!</h2>
      </div>
      <div className="profile-container">
        <div className="profile-icon" onClick={toggleDropDown}>
          <img src="user.svg" alt={`Perfil de ${userName}`} />
        </div>
        {isDropDownOpen && (
          <div className="dropdown-menu">
            <button onClick={toggleEditMenu} className="dropdown-item">
              Editar Perfil
            </button>
            <button onClick={handleLogout} className="dropdown-item delete">
              Sair
            </button>
          </div>
        )}
        {isEditOpen && (
          <div className="edit-popup">
            <div className="edit-menu">
              <h3 className="edit-title">Editar Perfil</h3>
              <label>Nome de Usuário:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <label>Email Atual:</label>
              <input
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
              />
              <label>Novo Email:</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button onClick={handleDeleteAccount} className="delete-account-button">
                Deletar Conta
              </button>
              <div className="edit-buttons">
                <button onClick={handleSaveChanges} className="save-button">Salvar</button>
                <button onClick={toggleEditMenu} className="close-button">Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
