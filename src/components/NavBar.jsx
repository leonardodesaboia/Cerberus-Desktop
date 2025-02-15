import { useState, useEffect } from "react";
import { isValidEmail } from '../validations/MailValidation';
import { getUserData, editUserData } from '../services/edit';  
import { Menu, X, Recycle } from "lucide-react";
import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userName, setUserName] = useState("");
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
    alert("Saiu");
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
      const updatedUser = await editUserData(updates);
      setUserName(updatedUser.userName);
      setOriginalEmail(updatedUser.email);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert(error.message);
    }
    setIsEditOpen(false);
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
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
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <a href="/" className="navbar-brand">
            <Recycle className="navbar-icon" />
            <span>EcoPoints</span>
          </a>
          
          <div className="navbar-links">
            <a href="#how-it-works" className="navbar-link">Sobre</a>
            <a href="#rewards" className="navbar-link">Rewards</a>
            <a href="#app" className="navbar-link">Conheça nosso app</a>
            <div className="profile-container">
              <div className="profile-icon" onClick={() => setIsDropDownOpen(!isDropDownOpen)}>
                <img src="user.svg" alt={`Perfil de ${userName}`} />
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
          <a href="#how-it-works" className="navbar-link">Sobre</a>
          <a href="#rewards" className="navbar-link">Rewards</a>
          <a href="#app" className="navbar-link">Conheça nosso app</a>
          <button className="navbar-button">Get Started</button>
        </div>
      </div>

      {isEditOpen && (
        <div className="edit-popup">
          <div className="edit-menu">
            <h3 className="edit-title">Editar Perfil</h3>
            <label>Nome de Usuário:</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
            
            <label>Email Atual:</label>
            <input type="email" value={currentEmail} disabled />
            
            <label>Novo Email:</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            
            <button onClick={() => alert('Deletar Conta')} className="delete-account-button">
                Deletar Conta
              </button>
            <div className="edit-buttons">
              <button onClick={handleSaveChanges} className="save-button">Salvar</button>
              <button onClick={() => setIsEditOpen(false)} className="close-button">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
