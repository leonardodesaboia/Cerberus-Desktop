import React, { useState } from 'react';
import './NavBar.css';

const NavBar = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
    setIsEditOpen(false);
  };

  const toggleEditMenu = () => {
    setIsEditOpen(!isEditOpen);
  };

  const handleLogout = () => {
    alert("saiu");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar a conta?");
    if (confirmDelete) {
      alert("Conta excluida!");
    }
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <h1>Cerberus</h1>
      </div>

      <div className="welcome">
        <span className="welcome-text">Bem-vindo,</span>
        <h2 className="user-name">João!</h2>
      </div>

      <div className="profile-container">
        <div className="profile-icon" onClick={toggleDropDown}>
          <img src="user.png" alt="Perfil de João" />
        </div>

        {isDropDownOpen && (
          <div className="dropdown-menu">
            <button onClick={toggleEditMenu} className="dropdown-item">
              Editar Perfil
            </button>
            <button onClick={handleDeleteAccount} className="dropdown-item delete">
              Deletar Conta
            </button>
            <button onClick={handleLogout} className="dropdown-item">
              Sair
            </button>
          </div>
        )}

        {isEditOpen && (
          <div className="edit-menu">
            <h3 className="edit-title">Editar Perfil</h3>
            {/* Add your edit profile form here */}
            <button onClick={toggleEditMenu} className="close-button">
              Fechar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;