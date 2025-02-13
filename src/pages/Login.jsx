import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
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
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao fazer login');
                }

                // Salva o token
                localStorage.setItem('token', data.token);
                
                // Opcional: salvar dados do usuário
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                // Redireciona para home
                navigate('/');
                
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
        <div className="page-container">
            <div className="content-wrapper">
                <div className="login-container">
                    <div className="login-header">
                        <h1>Cerberus</h1>
                    </div>

                    <div className="form-container-login">
                        {apiError && (
                            <div className="error-message">
                                {apiError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <Input 
                                label="Email" 
                                type="email" 
                                value={formData.email}
                                onChange={handleChange('email')}
                                onBlur={handleBlur('email')}
                                error={errors.email}
                                placeholder="Digite seu email"
                                disabled={isLoading}
                            />
                            
                            <Input 
                                label="Senha" 
                                type="password" 
                                value={formData.password}
                                onChange={handleChange('password')}
                                onBlur={handleBlur('password')}
                                error={errors.password}
                                placeholder="Digite sua senha"
                                disabled={isLoading}
                            />

                            <button 
                                type="submit" 
                                className="login-button"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </button>

                            <div className="create-account-login">
                                <a href="/register">Crie sua conta aqui</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="wave-container-login">
                <img src='/Vector.png' alt='Bottom img' className='wave-login'/>
            </div>
        </div>
    );
}

export default Login;