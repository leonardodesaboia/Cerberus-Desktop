import { useState, useEffect } from "react";
import { isValidEmail } from '../validations/MailValidation';
import { getUserData, editUserData } from '../services/api.jsx';  
import { Menu, X, Recycle, User, Edit, LogOut, Trash2, ShoppingBag, Home, Gift } from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/NavbarHome.css";
import { useNavigate } from 'react-router-dom';

const Navbar = (params) => {
  const navigate = useNavigate(); 
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isAppOpen, setIsAppOpen] = useState(false);

  // carregar dados dos usuarios
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        setUsername(userData.username || "");
        setCurrentEmail(userData.email || ""); 
        setOriginalEmail(userData.email || "");
        setUserId(userData.id);
        toast.success("Bem-vindo(a) de volta, " + (userData.username || ""));
      } catch (error) {
        toast.error("Erro ao carregar dados do usuário");
        console.error(error);
      }
    };
    loadUserData();
  }, [params.username]);

  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // fechar o popup qnd clica em qualquer canto da tela
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.profile-container');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // deletar usuario/remover e encaminhar p outra pag
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    toast.info("Logout realizado com sucesso. Até logo!");
    navigate("/");
  };

  // abrir pop ups
  const handleLogOutPopUp = () => {
    setIsLogoutOpen(true);
  };

  const handleAppOpen = () => {
    setIsAppOpen(true);
    toast.info("Escaneie o QR code para baixar nosso aplicativo");
  };

  // Toggle dropdown com feedback
  const toggleDropdown = () => {
    setIsDropDownOpen(!isDropDownOpen);
    if (!isDropDownOpen) {
      toast.info("Menu de perfil aberto");
    }
  };

  // Toggle menu mobile com feedback
  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      toast.info("Menu mobile aberto");
    } else {
      toast.info("Menu mobile fechado");
    }
  };

  // deletar usuario
  const deleteUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Usuário não identificado");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, { 
        method: "DELETE",
        headers: { 
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error("Erro ao excluir perfil");
      }
      
      toast.success("Conta excluída com sucesso");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error("Falha ao excluir conta");
      console.error(error);
    }
  };

  // abrir modal de edição com feedback
  const openEditModal = () => {
    setIsEditOpen(true);
    setIsDropDownOpen(false);
    toast.info("Edição de perfil aberta");
  };

  // fechar modal com feedback
  const closeEditModal = () => {
    setIsEditOpen(false);
    toast.info("Edição de perfil cancelada");
  };

  // Abrir modal de confirmação de exclusão com aviso
  const openDeleteConfirmation = () => {
    setIsDeleteOpen(true);
    toast.warning("Atenção: Você está prestes a excluir sua conta permanentemente!");
  };

  // Cancelar exclusão de conta
  const cancelDeleteAccount = () => {
    setIsDeleteOpen(false);
    toast.info("Exclusão de conta cancelada");
  };

  // salvar mudanças
  const handleSaveChanges = async () => {
    const updates = {};
    
    if (username.trim()) updates.username = username;
    if (newEmail.trim()) {
      if (isValidEmail(currentEmail, newEmail, originalEmail)) {
        updates.email = newEmail;
      } else {
        toast.error("Email inválido ou já está em uso");
        return;
      }
    }
    
    if (Object.keys(updates).length === 0) {
      toast.info("Nenhuma alteração foi feita.");
      setIsEditOpen(false);
      return;
    }
    
    try {
      const updatedUser = await editUserData(updates);
      setUsername(updatedUser.username);
      setOriginalEmail(updatedUser.email);
      toast.success("Perfil atualizado com sucesso!");
      navigate(0); //recarregar a pag após mudar as informações
    } catch (error) {
      toast.error(error.message || "Erro ao atualizar perfil");
      console.error(error);
    }
    setIsEditOpen(false);
  };

  // Validação de email em tempo real com feedback
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setNewEmail(email);
    
    if (email && email === currentEmail) {
      toast.info("Este já é seu email atual");
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <a href="/home" className="navbar-brand">
            <Recycle className="navbar-icon" />
            <span>EcoPoints</span>
          </a>

{/* navbar / links / edições etc */}
          <div className="navbar-links">
            <a href="/home" className="navbar-link">
              <Home size={18} className="link-icon" />
              <span>Home</span>
            </a>
            <a href="/store" className="navbar-link" onClick={() => toast.info("Acessando a loja de pontos...")}>
              <ShoppingBag size={18} className="link-icon" />
              <span>Loja de pontos</span>
            </a>
            <a href="/redeemed" className="navbar-link" onClick={() => toast.info("Acessando seus resgates...")}>
              <Gift size={18} className="link-icon" />
              <span>Resgates</span>
            </a>
            <a href="#app" className="navbar-link" onClick={handleAppOpen}>
              <span>Conheça nosso app</span>
            </a>

            <div className="profile-container">
              <button 
                className="profile-button"
                onClick={toggleDropdown}
                aria-label="Menu de perfil"
              >
                <User className="profile-icon" />
                <span className="profile-name">{username}</span>
              </button>
{/* menu dropdown pra editar cadastro/excluir conta e sair */}
              {isDropDownOpen && (
                <div className="dropdown-menu">
                  <button onClick={openEditModal} className="dropdown-item">
                    <Edit size={16} className="dropdown-icon" />
                    <span>Meu Cadastro</span>
                  </button>
                  
                  <button onClick={() => {
                    handleLogOutPopUp();
                    setIsDropDownOpen(false);
                  }} className="dropdown-item dropdown-logout">
                    <LogOut size={16} className="dropdown-icon" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>

{/* fechar menu  */}
          <button 
            className="navbar-menu-button" 
            onClick={toggleMobileMenu}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X className="navbar-menu-icon" /> : <Menu className="navbar-menu-icon" />}
          </button>
        </div>
      </div>

      {/* menu do mobile - responsivo */}
      <div className={`navbar-mobile-menu ${isOpen ? "open" : "closed"}`}>
        <div className="navbar-mobile-links">
          <a href="/home" className="mobile-link" onClick={() => toast.info("Acessando a página principal...")}>
            <Home size={18} className="mobile-link-icon" />
            <span>Home</span>
          </a>
          <a href="/store" className="mobile-link" onClick={() => toast.info("Acessando a loja de pontos...")}>
            <ShoppingBag size={18} className="mobile-link-icon" />
            <span>Loja de pontos</span>
          </a>
          <a href="/redeemed" className="mobile-link" onClick={() => toast.info("Acessando seus resgates...")}>
            <Gift size={18} className="mobile-link-icon" />
            <span>Resgates</span>
          </a>
          <a href="#app" className="mobile-link" onClick={() => {
            handleAppOpen();
            setIsOpen(false);
          }}>
            <span>Conheça nosso app</span>
          </a>
          <button onClick={() => {
            openEditModal();
            setIsOpen(false);
          }} className="mobile-link">
            <Edit size={18} className="mobile-link-icon" />
            <span>Meu Cadastro</span>
          </button>
          <button onClick={() => {
            handleLogOutPopUp();
            setIsOpen(false);
          }} className="mobile-link mobile-logout">
            <LogOut size={18} className="mobile-link-icon" />
            <span>Sair</span>
          </button>
        </div>
      </div>
      

      {/* pop up do qr code*/}
      {isAppOpen && (
        <div className="popup-overlay" onClick={() => {
          setIsAppOpen(false);
          toast.info("QR code fechado");
        }}>
          <div className="app-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Conheça nosso aplicativo!</h3>
              <button 
                onClick={() => {
                  setIsAppOpen(false);
                  toast.info("QR code fechado");
                }} 
                className="popup-close-button"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="qr-code-container">
              <img src="../public/qrCode.png" alt="QR Code do aplicativo" className="qr-code-image" />
              <p>Escaneie o QR code com seu celular para baixar nosso app</p>
            </div>
          </div>
        </div>
      )}

      {/* popup de confirmação de saída*/}
      {isLogoutOpen && (
        <div className="popup-overlay" onClick={() => setIsLogoutOpen(false)}>
          <div className="confirmation-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Sair da conta</h3>
              <button 
                onClick={() => {
                  setIsLogoutOpen(false);
                  toast.info("Logout cancelado");
                }} 
                className="popup-close-button"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <p>Tem certeza que deseja sair da sua conta?</p>
            <div className="popup-buttons">
              <button onClick={() => {
                handleLogout();
                setIsLogoutOpen(false);
              }} className="confirm-button">
                <LogOut size={16} className="button-icon" />
                <span>Sair</span>
              </button>
              <button onClick={() => {
                setIsLogoutOpen(false);
                toast.info("Logout cancelado");
              }} className="cancel-button">
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* popup de edição de perfil*/}
      {isEditOpen && (
        <div className="popup-overlay" onClick={closeEditModal}>
          <div className="edit-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Editar Cadastro</h3>
              <button 
                onClick={closeEditModal} 
                className="popup-close-button"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            {/* mostra o usuario atual e editar */}
            <div className="form-group">
              <label htmlFor="username">Nome de Usuário:</label>
              <div className="input-container">
                <User size={18} className="input-icon" />
                <input 
                  id="username"
                  type="text" 
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (e.target.value.length < 3 && e.target.value.length > 0) {
                      toast.warning("Nome de usuário deve ter pelo menos 3 caracteres");
                    }
                  }} 
                  value={username}
                  placeholder="Seu nome de usuário"
                />
              </div>
            </div>
    {/* mostra o email atual */}
            <div className="form-group">
              <label htmlFor="currentEmail">Email Atual:</label>
              <div className="input-container disabled">
                <input 
                  id="currentEmail"
                  type="email" 
                  value={currentEmail} 
                  disabled 
                />
              </div>
            </div>
{/* novo email */}
            <div className="form-group">
              <label htmlFor="newEmail">Novo Email:</label>
              <div className="input-container">
                <input 
                  id="newEmail"
                  type="email" 
                  value={newEmail} 
                  onChange={handleEmailChange} 
                  placeholder="Novo email (opcional)"
                />
              </div>
            </div>
{/* salvar td */}
            <div className="popup-buttons edit-buttons">
              <button onClick={handleSaveChanges} className="save-button">
                <span>Salvar alterações</span>
              </button>
              <button onClick={openDeleteConfirmation} className="delete-account-button">
                <Trash2 size={16} className="button-icon" />
                <span>Deletar conta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* popup de deleção de conta */}
      {isDeleteOpen && (
        <div className="popup-overlay" onClick={cancelDeleteAccount}>
          <div className="confirmation-popup danger-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Excluir Conta</h3>
              <button 
                onClick={cancelDeleteAccount}
                className="popup-close-button"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="warning-message">
              <p>Tem certeza que deseja excluir sua conta?</p>
              <p className="warning-text">Essa ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente.</p>
            </div>
            <div className="popup-buttons">
              <button onClick={() => {
                toast.warning("Processando exclusão de conta...");
                deleteUser();
                setIsDeleteOpen(false);
              }} className="danger-button">
                <Trash2 size={16} className="button-icon" />
                <span>Excluir permanentemente</span>
              </button>
              <button onClick={cancelDeleteAccount} className="cancel-button">
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;