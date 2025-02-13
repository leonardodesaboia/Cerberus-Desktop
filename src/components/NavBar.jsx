import React, { useState } from 'react';
import './navbar.css';

const NavBar = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isEditMailOpen, setIsEditMailOpen] = useState(false);

  const [userName, setUserName] = useState('João');
  const [currentEmail, setCurrentEmail] = useState('');
  const [email, setEmail] = useState('');
  const originalEmail = 'nickminaji@gmail.com';

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
    setIsEditOpen(false);
    setIsEditNameOpen(false);
  };

  const toggleEditMenu = () => {
    setIsEditOpen(!isEditOpen);
    setIsDropDownOpen(false);
  };

  const toggleNameEdit = () => {
    setIsEditNameOpen(!isEditNameOpen);
  };

  const toggleEditMail = () => {
    setIsEditMailOpen(!isEditMailOpen);
    setCurrentEmail('');
    setEmail('');
  };

  
  const handleLogout = () => {
    alert('Você saiu');
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar a conta?');
    if (confirmDelete) {
      alert('Conta excluída!');
      setIsEditOpen(false);
    }
  };

  const saveNameChange = () => {
    if (!userName.trim()) {
      alert('Por favor, insira um nome válido');
      return;
    }
    console.log('Novo nome salvo:', userName);
    setIsEditNameOpen(false);
  };


//validação
  const saveEmailChange = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!currentEmail || !email) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    if (!emailRegex.test(currentEmail) || !emailRegex.test(email)) {
      alert('Por favor, insira emails válidos');
      return;
    }

    if (currentEmail !== originalEmail) {
      alert('O email atual não corresponde ao email cadastrado');
      return;
    }

    if (currentEmail === email) {
      alert('O novo email deve ser diferente do email atual');
      return;
    }

    console.log('Novo email salvo:', email);
    setIsEditMailOpen(false);
  };

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
          <img src="user.png" alt="Perfil de João" />
        </div>

{/* MENU */}
        {isDropDownOpen && (
          <div className="dropdown-menu">
            <button onClick={toggleEditMenu} className="dropdown-item">
              Editar Perfil
            </button>
            <button onClick={handleLogout} className="dropdown-item">
              Sair
            </button>
          </div>
        )}

        {/* EDITAR NOME DE USUARIO */}

        {isEditOpen && (
          <div className="edit-popup">
            <div className="popup-content">
              <h3 className="edit-title">Editar Perfil</h3>
              
              <div className="profile-info">
                <div className="info-group">
                  <label>Nome de usuário:</label>
                  <span>{userName}</span>
                  <button onClick={toggleNameEdit} className="edit-btn">
                    Editar
                  </button>
                </div>

                {/* EDITAR EMAIL */}

                <div className="info-group">
                  <label>E-mail:</label>
                  <span>{originalEmail}</span>
                  <button onClick={toggleEditMail} className="edit-btn">
                    Editar
                  </button>
                </div>
              <button onClick={toggleEditMenu} className="close-btn-popup">
                Fechar
              </button>

              {/* EXCLUIR CONTA */}
                <div className="delete-account-popup">
                  <button onClick={handleDeleteAccount} className="delete-btn">
                    Excluir conta
                  </button>
                </div>
              </div>


            </div>
          </div>
        )}

        {/* EDIÇÃO NOME */}

        {isEditNameOpen && (
          <div className="edit-popup">
            <div className="popup-content">
              <h4>Editar nome de usuário</h4>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Digite o novo nome"
                className="edit-input"
              />
              <div className="button-group">
                <button onClick={saveNameChange} className="save-btn">
                  Salvar
                </button>
                <button onClick={toggleNameEdit} className="cancel-btn">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIÇÃO EMAIL */}

        {isEditMailOpen && (
          <div className="edit-popup">
            <div className="popup-content">
              <h4>Editar E-mail</h4>
              <input
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                placeholder="Digite seu E-mail atual"
                className="edit-input"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu novo e-mail"
                className="edit-input"
              />
              <div className="button-group">
                <button onClick={saveEmailChange} className="save-btn">
                  Salvar
                </button>
                <button onClick={toggleEditMail} className="cancel-btn">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default NavBar;