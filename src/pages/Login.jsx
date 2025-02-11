import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const navigate = useNavigate();

 const handleSubmit = (e) => {
   e.preventDefault();
  console.log('Email:', email);
  console.log('Password:', password);
  };

 return (
   <div className="login-page">
     <div className="pattern" />
     
     <div className="login-container">
       <div className="login-content">
         <h1>Bem vindo de volta</h1>
         <p>Preencha os campos abaixo com seus dados</p>

         <form onSubmit={handleSubmit} className="login-form">
            
           <div className="form-group">
             <label>Email</label>
             <input 
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Preencha seu email"
               required
             />
           </div>

           <div className="form-group" id='password'>
             <label>Password</label>
             <input 
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Preencha sua senha"
               required
             />
           </div>

           <button type="submit" onClick={() => navigate('/')}>Entrar</button>
         </form>

         <p className="signup-text">
           Não possui uma conta? <span onClick={() => navigate('/Register')}>Se inscrever</span>
         </p>
       </div>
     </div>
   </div>
 );
};

export default Login;