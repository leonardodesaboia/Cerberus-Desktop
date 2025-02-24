import { useState, useEffect } from "react";
import { isValidEmail } from '../validations/MailValidation';
import { getUserData, editUserData } from '../services/api.jsx';  
import { Menu, X, Recycle } from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/NavbarHome.css";
import { useNavigate } from 'react-router-dom';

// states
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
  const [userId, setUserId] = useState("")
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isAppOpen, setIsAppOpen] = useState(false)


//carregar dados do usuário
          useEffect(() => {
            const loadUserData = async () => {
              try {
                const userData = await getUserData();
                setUsername(userData.username || "");
                setCurrentEmail(userData.email || ""); 
                setOriginalEmail(userData.email || "");
                setUserId(userData.id)
              } catch (error) {
                toast.error("Erro ao carregar dados do usuário");
                console.error(error);
              }
            };
            loadUserData();
          }, []);

          useEffect(() => {
            const handleScroll = () => {
              setScrolled(window.scrollY > 20);
            };

            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
          }, []);



// caminho p qnd sai da conta
          const handleLogout = () => {
            navigate("/")
          };

// abrir popup
          const handleLogOutPopUp=()=>{
              setIsLogoutOpen(true)
          }

          const handleAppOpen=()=>{
            setIsAppOpen(true)
          }

        
// deletar conta 
        const deleteUser = async () => {
          const userId = localStorage.getItem("userId")
          console.log(localStorage.getItem("userId"))
          if (!userId) {
            return;
          }
          try {
            const response = await fetch(`http://localhost:3000/user/${userId}`, { 
              method: "DELETE",
              headers: { 'Content-Type': 'application/json',
                //'Authorization': `${localStorage.getItem("token")}`
              },
              
            });
        
            if (!response.ok) {
              throw new Error("Erro ao excluir perfil");
        
            }
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } catch (error) {
            console.error(error);
          }
        };

// salvar mudanças 
      const handleSaveChanges = async () => {
        const updates = {};
        if (username.trim()) updates.username = username;
        if (newEmail.trim() && isValidEmail(currentEmail, newEmail, originalEmail)) {
          updates.email = newEmail;
        }
        // if (Object.keys(updates).length === 0) {
        //   toast.warn("Nenhuma alteração foi feita.");
        //   return;
        // }
        try {
          const updatedUser = await editUserData(updates);
          setUsername(updatedUser.username);
          setOriginalEmail(updatedUser.email);
        } catch (error) {
          toast.error(error.message);
          console.error(error);
        }
        setIsEditOpen(false);
      };

  return (

// nav bar 
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <a href="/" className="navbar-brand">
            <Recycle className="navbar-icon" />
            <span>EcoPoints</span>
          </a>

{/* links app e edições */}
          <div className="navbar-links">
            <a href="/home" className="navbar-link" >Home</a>
            <a href="/store" className="navbar-link" >Loja de pontos</a>
            <a href="#app" className="navbar-link" onClick={handleAppOpen}>Conheça nosso app</a>


            {/*pop up conheça nosso app*/}
            {isAppOpen &&(
               <div className="app-popup">
               <div className="app-popup-code">
                 <h3>Escanei o QR code e conheça nosso aplicativo!</h3>
                 <div className="">
                   <img src="../public/qrCode.png" alt="" />
                 </div>
                   <button onClick={() => setIsAppOpen(false)} className="close-app-button">Fechar</button>
               </div>
             </div>
            )}

            <div className="profile-container">
              <div className="profile-icon" onClick={() => setIsDropDownOpen(!isDropDownOpen)}>
                <img src="user.svg" alt={`Perfil de ${username}`} />
              </div>

              {isDropDownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => setIsEditOpen(true)} className="dropdown-item">Meu Cadastro</button>
                  <button  className="dropdown-item"> <a href="/store">Meus Resgates</a></button>


{/* popup de confirmaçao de logout */}
                  <button onClick={() => handleLogOutPopUp(true)} className="dropdown-item delete">Sair</button>
                  {isLogoutOpen &&(
                    <div className="confirm-logout-popup">
                    <div className="confirm-logout-menu">
                      <h3>Tem certeza que deseja sair sua conta?</h3>
                      <div className="confirm-logout-buttons">
                        <button onClick={handleLogout} className="confirm-logout-button">Sim</button>
                        <button onClick={() => setIsLogoutOpen(false)} className="cancel-logout-button">Cancelar</button>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button className="navbar-menu-button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="navbar-menu-icon" /> : <Menu className="navbar-menu-icon" />}
          </button>
        </div>
      </div>

{/* app adc popup */}
      <div className={`navbar-mobile-menu ${isOpen ? "open" : "closed"}`}>
        <div className="navbar-mobile-links">
          <a href="#app" className="navbar-link">Conheça nosso app</a>
          <div className="profile-container">
            <div className="profile-icon" onClick={() => setIsDropDownOpen(!isDropDownOpen)}>
              <img src="user.svg" alt={`Perfil de ${username}`} />
            </div>

{/* menu dropdown */}
            {isDropDownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => setIsEditOpen(true)} className="dropdown-item">Meu cadastro</button>
                <button  className="dropdown-item">Resgates</button>
                <button onClick={handleLogout} className="dropdown-item delete">Sair</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
{/* popup de edição/exclusao de conta */}
      {isEditOpen && (
        <div className="edit-popup">
          <div className="edit-menu">
            <h3>Editar cadastro</h3>
            <label>Nome de Usuário:</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} value={username}/>
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

      {/* popup de confirmação de exclusão */}
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