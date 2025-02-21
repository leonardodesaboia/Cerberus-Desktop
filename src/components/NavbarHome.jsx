import { useState, useEffect } from "react";
import { isValidEmail } from '../validations/MailValidation';
import { getUserData, editUserData } from '../services/api.jsx';  
import { Menu, X, Recycle } from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/NavbarHome.css";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate(); 
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    navigate("/")
  };

  // deletar conta 
  const deleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Erro ao excluir perfil");
      }
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        setUsername(userData.username || "");
        setCurrentEmail(userData.email || ""); 
        setOriginalEmail(userData.email || "");
      } catch (error) {
        toast.error("Erro ao carregar dados do usuário");
        console.error(error);
      }
    };
    loadUserData();
  }, []);

  const handleSaveChanges = async () => {
    const updates = {};
    if (username.trim()) updates.username = username;
    if (newEmail.trim() && isValidEmail(currentEmail, newEmail, originalEmail)) {
      updates.email = newEmail;
    }
    if (Object.keys(updates).length === 0) {
      toast.warn("Nenhuma alteração foi feita.");
      return;
    }
    try {
      const updatedUser = await editUserData(updates);
      setUsername(updatedUser.username);
      setOriginalEmail(updatedUser.email);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
    setIsEditOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <a href="/" className="navbar-brand">
            <Recycle className="navbar-icon" />
            <span>EcoPoints</span>
          </a>
          <div className="navbar-links">
            <a href="#app" className="navbar-link">Conheça nosso app</a>
            <div className="profile-container">
              <div className="profile-icon" onClick={() => setIsDropDownOpen(!isDropDownOpen)}>
                <img src="user.svg" alt={`Perfil de ${username}`} />
              </div>
              {isDropDownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => setIsEditOpen(true)} className="dropdown-item">Editar Perfil</button>
                  <button onClick={handleLogout} className="dropdown-item delete">Sair</button>
                </div>
              )}
            </div>
          </div>
          <button className="navbar-menu-button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="navbar-menu-icon" /> : <Menu className="navbar-menu-icon" />}
          </button>
        </div>
      </div>

      <div className={`navbar-mobile-menu ${isOpen ? "open" : "closed"}`}>
        <div className="navbar-mobile-links">
          <a href="#app" className="navbar-link">Conheça nosso app</a>
          <div className="profile-container">
            <div className="profile-icon" onClick={() => setIsDropDownOpen(!isDropDownOpen)}>
              <img src="user.svg" alt={`Perfil de ${username}`} />
            </div>

            {isDropDownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => setIsEditOpen(true)} className="dropdown-item">Editar Perfil</button>
                <button onClick={handleLogout} className="dropdown-item delete">Sair</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isEditOpen && (
        <div className="edit-popup">
          <div className="edit-menu">
            <h3>Editar Perfil</h3>
            <label>Nome de Usuário:</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} />
            <label>Email Atual:</label>
            <input type="email" value={currentEmail} disabled />
            <label>Novo Email:</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <div className="edit-buttons">
              <button onClick={handleSaveChanges} className="save-button">Salvar</button>
              <button onClick={() => setIsEditOpen(false)} className="close-button">Fechar</button>
            </div>
             {/* Botão para abrir o pop-up de confirmação */}
             <button onClick={() => setIsDeleteOpen(true)} className="delete-account-button">
              Deletar conta
            </button>
          </div>
        </div>
      )}

      {/* Pop-up de confirmação de exclusão */}
      {isDeleteOpen && (
        <div className="confirm-delete-popup">
          <div className="confirm-delete-menu">
            <h3>Tem certeza que deseja excluir sua conta?</h3>
            <p>Essa ação não pode ser desfeita.</p>
            <div className="confirm-buttons">
              <button onClick={deleteUser} className="confirm-button">Confirmar</button>
              <button onClick={() => setIsDeleteOpen(false)} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;