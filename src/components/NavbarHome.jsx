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

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        setUsername(userData.username || "");
        setCurrentEmail(userData.email || ""); 
        setOriginalEmail(userData.email || "");
        setUserId(userData.id);
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

  // Close dropdown when clicking outside
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

  // Handler functions
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleLogOutPopUp = () => {
    setIsLogoutOpen(true);
  };

  const handleAppOpen = () => {
    setIsAppOpen(true);
  };

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

  const handleSaveChanges = async () => {
    const updates = {};
    
    if (username.trim()) updates.username = username;
    if (newEmail.trim() && isValidEmail(currentEmail, newEmail, originalEmail)) {
      updates.email = newEmail;
    } else if (newEmail.trim() && !isValidEmail(currentEmail, newEmail, originalEmail)) {
      toast.error("Email inválido");
      return;
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
      navigate(0);
    } catch (error) {
      toast.error(error.message || "Erro ao atualizar perfil");
      console.error(error);
    }
    setIsEditOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <a href="/home" className="navbar-brand">
            <Recycle className="navbar-icon" />
            <span>EcoPoints</span>
          </a>

          <div className="navbar-links">
            <a href="/home" className="navbar-link">
              <Home size={18} className="link-icon" />
              <span>Home</span>
            </a>
            <a href="/store" className="navbar-link">
              <ShoppingBag size={18} className="link-icon" />
              <span>Loja de pontos</span>
            </a>
            <a href="/redeemed" className="navbar-link">
              <Gift size={18} className="link-icon" />
              <span>Resgates</span>
            </a>
            <a href="#app" className="navbar-link" onClick={handleAppOpen}>
              <span>Conheça nosso app</span>
            </a>

            <div className="profile-container">
              <button 
                className="profile-button"
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                aria-label="Menu de perfil"
              >
                <User className="profile-icon" />
                <span className="profile-name">{username}</span>
              </button>

              {isDropDownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => {
                    setIsEditOpen(true);
                    setIsDropDownOpen(false);
                  }} className="dropdown-item">
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

          <button 
            className="navbar-menu-button" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X className="navbar-menu-icon" /> : <Menu className="navbar-menu-icon" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`navbar-mobile-menu ${isOpen ? "open" : "closed"}`}>
        <div className="navbar-mobile-links">
          <a href="/home" className="mobile-link">
            <Home size={18} className="mobile-link-icon" />
            <span>Home</span>
          </a>
          <a href="/store" className="mobile-link">
            <ShoppingBag size={18} className="mobile-link-icon" />
            <span>Loja de pontos</span>
          </a>
          <a href="/redeemed" className="mobile-link">
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
            setIsEditOpen(true);
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
      
      {/* QR Code App Popup */}
      {isAppOpen && (
        <div className="popup-overlay" onClick={() => setIsAppOpen(false)}>
          <div className="app-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Conheça nosso aplicativo!</h3>
              <button 
                onClick={() => setIsAppOpen(false)} 
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

      {/* Logout Confirmation Popup */}
      {isLogoutOpen && (
        <div className="popup-overlay" onClick={() => setIsLogoutOpen(false)}>
          <div className="confirmation-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Sair da conta</h3>
              <button 
                onClick={() => setIsLogoutOpen(false)} 
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
              <button onClick={() => setIsLogoutOpen(false)} className="cancel-button">
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Popup */}
      {isEditOpen && (
        <div className="popup-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="edit-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Editar Cadastro</h3>
              <button 
                onClick={() => setIsEditOpen(false)} 
                className="popup-close-button"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Nome de Usuário:</label>
              <div className="input-container">
                <User size={18} className="input-icon" />
                <input 
                  id="username"
                  type="text" 
                  onChange={(e) => setUsername(e.target.value)} 
                  value={username}
                  placeholder="Seu nome de usuário"
                />
              </div>
            </div>
            
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
            
            <div className="form-group">
              <label htmlFor="newEmail">Novo Email:</label>
              <div className="input-container">
                <input 
                  id="newEmail"
                  type="email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  placeholder="Novo email (opcional)"
                />
              </div>
            </div>

            <div className="popup-buttons edit-buttons">
              <button onClick={handleSaveChanges} className="save-button">
                <span>Salvar alterações</span>
              </button>
              <button onClick={() => setIsDeleteOpen(true)} className="delete-account-button">
                <Trash2 size={16} className="button-icon" />
                <span>Deletar conta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {isDeleteOpen && (
        <div className="popup-overlay" onClick={() => setIsDeleteOpen(false)}>
          <div className="confirmation-popup danger-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Excluir Conta</h3>
              <button 
                onClick={() => setIsDeleteOpen(false)} 
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
                deleteUser();
                setIsDeleteOpen(false);
              }} className="danger-button">
                <Trash2 size={16} className="button-icon" />
                <span>Excluir permanentemente</span>
              </button>
              <button onClick={() => setIsDeleteOpen(false)} className="cancel-button">
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