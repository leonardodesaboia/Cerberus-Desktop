import { useState, useEffect, useRef } from 'react';
import { registerUser, loginUser, getUserData } from '../services/api';
import Input from '../components/Input';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from "framer-motion";
import { useDebounce } from 'react-use';

function Register() {
    const navigate = useNavigate();
    // Referência para rastrear erros já exibidos
    const displayedErrors = useRef({});
    
    const [formData, setFormData] = useState({
        email: '',
        cpf: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        cpf: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [touched, setTouched] = useState({
        email: false, 
        cpf: false,
        username: false,
        password: false,
        confirmPassword: false
    });

    // estados
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [navigationError, setNavigationError] = useState('');
    const [isShow, setIsShow] = useState(false);
    
    // Estado para armazenar valores a serem validados com debounce
    const [debouncedValues, setDebouncedValues] = useState({
        email: '',
        username: '',
        password: '',
        cpf: ''
    });

    // validadores
    const validators = {
        email: (value) => {
            if (!value) {
                return 'Email é obrigatório';
            }
        
            // Remove espaços em branco
            value = value.trim();
        
            // Verifica se tem exatamente um @
            const atCount = (value.match(/@/g) || []).length;
            if (atCount !== 1) {
                return 'Email deve conter exatamente um @';
            }
        
            const [localPart, domain] = value.split('@');
        
            // Validações da parte local (antes do @)
            if (!localPart || localPart.length < 3) {
                return 'Parte local do email deve ter pelo menos 3 caracteres';
            }
            if (localPart.length > 64) {
                return 'Parte local do email não pode ter mais de 64 caracteres';
            }
        
            // Regex para parte local
            const localPartRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]$/;
            if (!localPartRegex.test(localPart)) {
                return 'Email deve começar e terminar com letra ou número';
            }
        
            // Validações do domínio (depois do @)
            if (!domain) {
                return 'Domínio do email não pode estar vazio';
            }
            if (domain.length > 255) {
                return 'Domínio do email não pode ter mais de 255 caracteres';
            }
            if (!domain.includes('.')) {
                return 'Domínio deve conter pelo menos um ponto';
            }
        
            // Nova regex para o domínio - apenas letras, pontos e hífens
            const domainRegex = /^[a-zA-Z][-a-zA-Z.]*[a-zA-Z](\.[a-zA-Z]{2,})+$/;
            if (!domainRegex.test(domain)) {
                return 'Domínio deve conter apenas letras, pontos e hífens';
            }
        
            // Verifica sequências de caracteres especiais
            if (value.includes('..') || value.includes('--') || value.includes('__')) {
                return 'Email não pode conter sequências de caracteres especiais';
            }
        
            // Verifica se começa ou termina com caracteres especiais
            if (/^[._-]|[._-]$/.test(localPart)) {
                return 'Email não pode começar ou terminar com caracteres especiais';
            }
        
            // Verificação de padrões suspeitos
            const suspiciousPatterns = [
                /[^a-zA-Z0-9]{3,}/         // Mais de 2 caracteres especiais seguidos
            ];
        
            for (const pattern of suspiciousPatterns) {
                if (pattern.test(value)) {
                    return 'Formato de email inválido';
                }
            }
        
            return '';
        },

        cpf: (value) => {
            // Remove formatação para validar
            const cpfClean = value.replace(/\D/g, '');
            
            if (!cpfClean) {
                return 'CPF é obrigatório';
            }
            if (cpfClean.length !== 11) {
                // return 'CPF deve conter 11 dígitos';
            }
            
            // Verifica dígitos repetidos
            if (/^(\d)\1{10}$/.test(cpfClean)) {
                return 'CPF inválido';
            }
            
            // Validação dos dígitos verificadores
            let sum = 0;
            let remainder;
            
            // Primeiro dígito verificador
            for (let i = 1; i <= 9; i++) {
                sum = sum + parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
            }
            
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpfClean.substring(9, 10))) {
                return 'CPF inválido';
            }
            
            // Segundo dígito verificador
            sum = 0;
            for (let i = 1; i <= 10; i++) {
                sum = sum + parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
            }
            
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpfClean.substring(10, 11))) {
                return 'CPF inválido';
            }
            
            return '';
        },

        username: (value) => {
            if (!value) {
                return 'Username é obrigatório';
            }
            if (value.length < 3) {
                return 'Username deve ter no mínimo 3 caracteres';
            }
            if (value.length > 20) {
                return 'Username deve ter no máximo 20 caracteres';
            }
            if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                return 'Username deve conter apenas letras, números e _';
            }
            return '';
        },

        password: (value) => {
            if (!value) {
                return 'Senha é obrigatória';
            }
            if (value.length < 8) {
                return 'Senha deve ter no mínimo 8 caracteres';
            }
            if (value.length > 32) {
                return 'Senha deve ter no máximo 32 caracteres';
            }
        
            // Verifica se há caracteres não permitidos
            const allowedCharsRegex = /^[a-zA-Z0-9!@#$%^&*]+$/;
            if (!allowedCharsRegex.test(value)) {
                return 'Senha deve conter apenas letras, números e caracteres especiais (!@#$%^&*)';
            }
        
            // Verifica requisitos mínimos
            if (!/[A-Z]/.test(value)) {
                return 'Senha deve conter pelo menos uma letra maiúscula';
            }
            if (!/[a-z]/.test(value)) {
                return 'Senha deve conter pelo menos uma letra minúscula';
            }
            if (!/[0-9]/.test(value)) {
                return 'Senha deve conter pelo menos um número';
            }
            if (!/[!@#$%^&*]/.test(value)) {
                return 'Senha deve conter pelo menos um caractere especial (!@#$%^&*)';
            }
        
            // Verifica sequências repetidas
            if (/(.)\1{2,}/.test(value)) {
                return 'Senha não pode conter três ou mais caracteres iguais em sequência';
            }
        
            // Verifica espaços
            if (/\s/.test(value)) {
                return 'Senha não pode conter espaços';
            }
        
            // Verifica se todos os caracteres estão dentro do range ASCII básico
            for (let i = 0; i < value.length; i++) {
                if (value.charCodeAt(i) > 127) {
                    return 'Senha não pode conter emojis ou caracteres especiais não permitidos';
                }
            }
        
            return '';
        },
        
        confirmPassword: (value, password) => {
            if (!value) {
                return 'Confirmação de senha é obrigatória';
            }
            if (value !== password) {
                return 'As senhas não coincidem';
            }
            return '';
        }
    };

    // Função para mostrar erros sem repetição
    const showErrorOnce = (field, error) => {
        // Só mostra o erro se ele for diferente do último erro mostrado para este campo
        if (error && displayedErrors.current[field] !== error) {
            displayedErrors.current[field] = error;
            toast.error(error, {
                duration: 3500, // 3.5 segundos
                id: `${field}-error` // ID único para evitar duplicatas do mesmo tipo
            });
        }
    };

    // Aplicar debounce para email - verificação quando PARAR de digitar
    useDebounce(
        () => {
            if (touched.email && debouncedValues.email) {
                const error = validators.email(debouncedValues.email);
                setErrors(prev => ({ ...prev, email: error }));
                // Não mostrar toast durante digitação
            }
        },
        800, // aumentado para reduzir frequência
        [debouncedValues.email]
    );

    // Aplicar debounce para CPF
    useDebounce(
        () => {
            if (touched.cpf && debouncedValues.cpf) {
                const error = validators.cpf(debouncedValues.cpf);
                setErrors(prev => ({ ...prev, cpf: error }));
                // Não mostrar toast durante digitação
            }
        },
        800,
        [debouncedValues.cpf]
    );

    // Aplicar debounce para username
    useDebounce(
        () => {
            if (touched.username && debouncedValues.username) {
                const error = validators.username(debouncedValues.username);
                setErrors(prev => ({ ...prev, username: error }));
                // Não mostrar toast durante digitação
            }
        },
        800,
        [debouncedValues.username]
    );

    // Aplicar debounce para password
    useDebounce(
        () => {
            if (touched.password && debouncedValues.password) {
                const error = validators.password(debouncedValues.password);
                setErrors(prev => ({ ...prev, password: error }));
                // Não mostrar toast durante digitação
            }
        },
        800,
        [debouncedValues.password]
    );

    // enviar
    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError('');
        setSuccessMessage('');
        
        // Marcar todos os campos como tocados
        const allTouched = Object.keys(touched).reduce(
            (acc, key) => ({ ...acc, [key]: true }), 
            {}
        );
        setTouched(allTouched);

        // Validar todos os campos
        const newErrors = {
            email: validators.email(formData.email),
            cpf: validators.cpf(formData.cpf.replace(/\D/g, '')),
            username: validators.username(formData.username),
            password: validators.password(formData.password),
            confirmPassword: validators.confirmPassword(
                formData.confirmPassword, 
                formData.password
            )
        };

        setErrors(newErrors);

        // Mostrar todos os erros do formulário
        Object.entries(newErrors).forEach(([field, error]) => {
            if (error) {
                showErrorOnce(field, error);
            }
        });
        
        // Verificar se há erros
        const hasErrors = Object.values(newErrors).some(error => error !== '');
        
        if (!hasErrors) {
            setIsLoading(true);
            try {
                const userData = {
                    email: formData.email,
                    cpf: formData.cpf.replace(/\D/g, ''),
                    username: formData.username,
                    password: formData.password,
                };

                const response = await registerUser(userData);
                setFormSubmitted(true);
                toast.success('Cadastro realizado com sucesso!');
                console.log('Cadastro realizado com sucesso:', response);
                
                // Limpar formulário após sucesso
                setFormData({
                    email: '',
                    cpf: '',
                    username: '',
                    password: '',
                    confirmPassword: ''
                });

                setTouched({
                    email: false,
                    cpf: false,
                    username: false,
                    password: false,
                    confirmPassword: false
                });

                setErrors({
                    email: '',
                    cpf: '',
                    username: '',                
                    password: '',
                    confirmPassword: ''
                });
                
                // Resetar erros mostrados
                displayedErrors.current = {};
                
                const data = await loginUser(formData);
                // Salva o token
                const token = data.token
                const arrayToken = token.split('.');
                const tokenPayload = JSON.parse(atob(arrayToken[1]));
                localStorage.setItem('userId', tokenPayload.id);
                localStorage.setItem('token', token);
                navigate('/home');
            } catch (error) {
                setFormSubmitted(false);
                
                // Tratamento específico para erros de duplicação
                if (error.message.includes('duplicate key error')) {
                    if (error.message.includes('email_1')) {
                        toast.error('Este email já está cadastrado em nossa base de dados');
                        setApiError('Este email já está cadastrado em nossa base de dados'); 
                    } else if (error.message.includes('cpf_1')) {
                        toast.error('Este CPF já está cadastrado em nossa base de dados');
                        setApiError('Este CPF já está cadastrado em nossa base de dados');
                    } else {
                        toast.error('Este registro já existe em nossa base de dados');
                        setApiError('Este registro já existe em nossa base de dados');
                    }
                } else {
                    setApiError('Ocorreu um erro ao realizar o cadastro. Por favor, tente novamente.');
                }
                
                console.error('Erro no cadastro:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const formatCPF = (value) => {
        // Remove tudo que não é número
        const cpf = value.replace(/\D/g, '');
        
        // Adiciona os pontos e traço conforme digita
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    // Função para atualizar o formData
    const handleChange = (field) => (e) => {
        let value = e.target.value;
        
        // Se for o campo CPF, aplica a formatação
        if (field === 'cpf') {
            const numbersOnly = value.replace(/\D/g, '');
            if (numbersOnly.length <= 11) {
                value = formatCPF(numbersOnly);
            } else {
                return;
            }
        }

        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Atualiza os valores para debounce para todos os campos
        setDebouncedValues(prev => ({ ...prev, [field]: value }));
    };

    // Função para marcar campo como tocado e validar apenas ao sair do campo
    const handleBlur = (field) => () => {
        if (!touched[field]) {
            setTouched(prev => ({ ...prev, [field]: true }));
        }
        
        let valueToValidate = formData[field];
        if (field === 'cpf') {
            valueToValidate = formData[field].replace(/\D/g, '');
        }
        
        const validationError = field === 'confirmPassword'
            ? validators[field](formData[field], formData.password)
            : validators[field](valueToValidate);
        
        setErrors(prev => ({ ...prev, [field]: validationError }));
        
        // Mostrar erro apenas quando o usuário sair do campo
        showErrorOnce(field, validationError);
    };

    // Validar confirmação de senha quando a senha mudar
    useEffect(() => {
        if (touched.confirmPassword && formData.confirmPassword) {
            const validationError = validators.confirmPassword(formData.confirmPassword, formData.password);
            setErrors(prev => ({ ...prev, confirmPassword: validationError }));
            
            // Não mostrar toast durante digitação da senha, apenas na saída do campo
        }
    }, [formData.password, touched.confirmPassword]);

    const handlePassword = () => {
        setIsShow(!isShow);
    };

    return (
        <div className="register-container">
            <Toaster 
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 3500, 
                    style: {
                        borderRadius: '10px',
                        color: '#00000',
                    },
                }}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="register-card"
            >
                <div className="register-image-container">
                    {/* <img src="../public/register-eco-illustration.svg" alt="Ilustração de sustentabilidade" className="register-image" /> */}
                </div>
                
                <div className="register-form-section">
                    <div className="register-header">
                        <h1 className="register-title">
                            <img src="../public/recycle.png" alt="" className="logo"/> EcoPoints
                        </h1>
                        <p className="register-subtitle">Crie sua conta e comece a contribuir</p>
                    </div>

                    {/* {apiError && <div className="error-message-register">{apiError}</div>} */}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {navigationError && <div className="error-message">{navigationError}</div>}
            
                    <motion.form 
                        className="register-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label>E-mail</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            onBlur={handleBlur('email')}
                            placeholder="Digite seu email"
                            disabled={isLoading}
                        /> 
                        </div>
                       
                        <div>
                             <label>CPF</label>
                        <Input
                            type="text"
                            value={formData.cpf}
                            onChange={handleChange('cpf')}
                            onBlur={handleBlur('cpf')}
                            placeholder="Digite o seu CPF"
                            disabled={isLoading}
                        />
                        </div>
                       

                        <div>
                           <label>Usuário</label>
                        <Input
                            type="text"
                            value={formData.username}
                            onChange={handleChange('username')}
                            onBlur={handleBlur('username')}
                            placeholder="Digite o seu nome de usuário"
                            disabled={isLoading}
                        /> 
                        </div>
                        
            
                        <div className="password-container">
                            <label>Senha</label>
                            <Input
                                type={isShow ? "text" : "password"} 
                                value={formData.password}
                                onChange={handleChange('password')}
                                onBlur={handleBlur('password')}
                                placeholder="Digite sua senha"
                                disabled={isLoading}
                            />
                            <span className="showPass" onClick={handlePassword}>
                                {isShow ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </span>
                        </div>
            
                        <div className="password-container">
                            <label>Confirmar senha</label>
                            <Input
                                type={isShow ? "text" : "password"} 
                                value={formData.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                placeholder="Confirme sua senha"
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="password-requirements">
                            <span>A senha deve conter no mínimo:</span>
                            <ul>
                                <li>8 caracteres</li>
                                <li>Uma letra maiúscula</li>
                                <li>Uma letra minúscula</li>
                                <li>Um símbolo (!@#$%^&*)</li>
                                <li>Um número</li>
                            </ul>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="register-button" 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processando...' : 'Cadastrar'}
                            </button>
                            
                            <div className="login-link">
                                Já tem uma conta? <a href="/login">Faça login aqui</a>
                            </div>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </div>
    );
}

export default Register;