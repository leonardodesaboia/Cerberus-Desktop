import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { loginUser, getUserData } from '../services/api';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from "framer-motion";
import '../styles/Login.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [touched, setTouched] = useState({
        email: false,
        password: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [isShow, setIsShow] = useState(false);

    const validators = {
        email: (value) => {
            if (!value) return 'Email é obrigatório';
            value = value.trim();
            const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z][-a-zA-Z.]*[a-zA-Z](\.[a-zA-Z]{2,})+$/;
            if (!emailRegex.test(value)) return 'Email inválido';
            return '';
        },
        password: (value) => {
            if (!value) return 'Senha é obrigatória';
            return '';
        }
    };

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        
        if (touched[field]) {
            const validationError = validators[field](value);
            setErrors(prev => ({ ...prev, [field]: validationError }));
        }
    };

    const handleBlur = (field) => () => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const validationError = validators[field](formData[field]);
        setErrors(prev => ({ ...prev, [field]: validationError }));
    };

    const handlePassword = () => {
        setIsShow(!isShow);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError('');

        setTouched({
            email: true,
            password: true
        });

        const newErrors = {
            email: validators.email(formData.email),
            password: validators.password(formData.password)
        };
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (!hasErrors) {
            setIsLoading(true);
            try {
                const data = await loginUser(formData);

                // Salva o token
                const token = data.token;
                const arrayToken = data.token.split('.');
                const tokenPayload = JSON.parse(atob(arrayToken[1]));
                localStorage.setItem('token', token);
                localStorage.setItem('userId', tokenPayload.id);
                localStorage.setItem('user', await getUserData());
                
                navigate('/home');
                
            } catch (error) {
                if (error.message.includes('credenciais')) {
                    setApiError('Email ou senha incorretos');
                } else {
                    setApiError('Erro ao fazer login. Por favor, tente novamente.');
                }
                console.error('Erro no login:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="login-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="login-card"
            >
                <div className="login-image-container">
                    {/* <img src="../public/lixo1.jpeg" alt="Ilustração de sustentabilidade e reciclagem" className="login-image" /> */}
                </div>
                
                <div className="login-form-section">
                    <div className="login-header">
                        <h1 className="login-title">
                            <img src="../public/recycle.png" alt="" className="logo-acc"/> EcoPoints
                        </h1>
                        <p className="login-subtitle">Faça login para acessar sua conta</p>
                    </div>

                    {apiError && (
                        <div className="error-message">
                            {apiError}
                        </div>
                    )}

                    <motion.form 
                        onSubmit={handleSubmit} 
                        className="login-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Input 
                            label="Email" 
                            type="text" 
                            value={formData.email}
                            onChange={handleChange('email')}
                            onBlur={handleBlur('email')}
                            error={errors.email}
                            placeholder="Digite seu email"
                            disabled={isLoading}
                        />
                        
                        <div className="password-container">
                            <Input 
                                label="Senha" 
                                type={isShow ? "text" : "password"} 
                                value={formData.password}
                                onChange={handleChange('password')}
                                onBlur={handleBlur('password')}
                                error={errors.password}
                                placeholder="Digite sua senha"
                                disabled={isLoading} 
                            />
                            <span className="showPass" onClick={handlePassword}>
                                {isShow ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </span>
                        </div>

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>

                        <div className="login-register-link">
                            Não tem uma conta? <a href="/register">Crie sua conta aqui</a>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;