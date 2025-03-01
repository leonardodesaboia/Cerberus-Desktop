import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/sendEmail.css';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {resetPassword} from '../services/api'

const SendEmail= () => {
  const [email, setEmail] = useState()
  const [emailError, setEmailError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState()
  const [successMessage, setSuccessMessage] = useState()

  useEffect(() => {
    setApiError('');
    setSuccessMessage('');
  }, [email]);

  const validateEmail = (email) => {
    if (!email) return 'Email é obrigatório';
    
    email = email.trim();
    
    const atCount = (email.match(/@/g) || []).length;
    if (atCount !== 1) return 'Email deve conter exatamente um @';
    
    const [localPart, domain] = email.split('@');
    
    if (!localPart || localPart.length < 3) return 'Parte local do email deve ter pelo menos 3 caracteres';
    if (!domain) return 'Domínio do email não pode estar vazio';
    if (!domain.includes('.')) return 'Domínio deve conter pelo menos um ponto';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Formato de email inválido';
    }
    
    return '';
  };

  const handleSubmit = async (e) => { // Added the event parameter here
    e.preventDefault();
    
    const emailValidationError = validateEmail(email);
    setEmailError(emailValidationError);
    
    if (emailValidationError) {
      return;
    }
    
    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');
    
    try {
      const response = await resetPassword(email);
      setSuccessMessage(response.message);
      // Limpar o campo de email após o sucesso
      setEmail('');
    } catch (err) {
      setApiError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="send-email-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="send-email-card"
      >
        <div className="send-email-image-container">
          {/* Imagem ilustrativa pode ser adicionada aqui */}
        </div>
        
        <div className="send-email-form-section">
          <div className="send-email-header">
            <Link to="/login" className="back-link">
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </Link>
            <h1 className="send-email-title">
              <img src="../public/recycle.png" alt="" className="logo"/> EcoPoints
            </h1>
            <p className="send-email-subtitle">Esqueceu sua senha?</p>
            <p className="send-email-description">
              Digite seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
            </p>
          </div>

          {apiError && (
            <div className="error-message">
              {apiError}
            </div>
          )}
          
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
      
          <motion.form 
            className="send-email-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
          >
            <div className="input-container">
              <label htmlFor="email">Email</label>
              <div className="email-input-wrapper">
                <Mail size={20} className="email-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email cadastrado"
                  disabled={isLoading}
                  className={emailError ? "input-error" : ""}
                />
              </div>
              {emailError && <div className="error-text">{emailError}</div>}
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="send-email-button" 
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Redefinir senha'}
              </button>
              
              <div className="login-signup-links">
                <div className="login-link">
                  Lembrou a senha? <Link to="/login">Faça login aqui</Link>
                </div>
                <div className="signup-link">
                  Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
                </div>
              </div>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default SendEmail;