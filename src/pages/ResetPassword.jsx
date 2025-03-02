import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { emailResetPassword } from '../services/api';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/resetPassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    useEffect(() => {
        setError('');
        setSuccessMessage('');
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        
        try {
            const response = await emailResetPassword(token, password);
            setSuccessMessage(response.message);
        } catch (err) {
            setError(err.message);
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    
    return (
        <div className="reset-password-container">
            <div className="reset-password-form">
                <h2>Redefinir Senha</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">Nova Senha</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="password-toggle" onClick={togglePasswordVisibility}>
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                                {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="reset-button">Alterar Senha</button>
                </form>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
            </div>
        </div>
    );
};

export default ResetPassword;