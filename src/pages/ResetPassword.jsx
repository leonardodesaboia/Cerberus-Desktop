import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { emailResetPassword } from '../services/api';
import '../styles/resetPassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
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
    
    return (
        <div className="reset-password-container">
            <div className="reset-password-form">
                <h2>Redefinir Senha</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">Nova Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
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