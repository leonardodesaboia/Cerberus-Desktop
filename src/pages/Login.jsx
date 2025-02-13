import { useState } from 'react';
import Input from '../components/Input';
import '../styles/Login.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log('Email:', email);
      console.log('Password:', password);
    };
  
    return (
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <h1>Cerberus</h1>
        </div>
  
        {/* Formulário */}
        <div className="form-container-login">
          <form onSubmit={handleSubmit} className="login-form">
            <Input 
              label="Email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />
            
            <Input 
              label="Senha" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
  
            {/* <div className="forgot-password">
              <a href="#">Esqueceu senha?</a>
            </div> */}
  
            <button type="submit" className="login-button">
              Entrar
            </button>
  
            <div className="create-account-login">
              <a href="#">Crie sua conta aqui</a>
            </div>
          </form>
        </div>
  
        <div className="wave-container-login">
            <img src='/Vector.png' alt='Bottom img'className='wave-login'/>
        </div>
      </div>
    );
  }
  
  export default Login;