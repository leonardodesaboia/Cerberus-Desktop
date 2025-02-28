import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import '../styles/resetPassword.css';
import { resetPassword } from '../services/api';  

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
            const response = await resetPassword(token, password);  
            setSuccessMessage(response.message); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Redefinir Senha</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Nova Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Confirmar Senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-btn">Alterar Senha</button>
                </form>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
            </div>
        </div>
    );
};

export default ResetPassword;