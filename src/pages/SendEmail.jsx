import React from 'react'
import '../styles/sendEmail.css'

const SendEmail = () => {
  return (
    <div className='page-container'>
      <div className='email-send-container'>
        <div className='send-message'>
          <h2>Informe seu e-mail cadastrado</h2>
          <div className="input-send-mail-container">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="exemplo@email.com" />
          </div>
          <button className="reset-button">Redefinir senha</button>
        </div>
      </div>
    </div>
  )
}

export default SendEmail