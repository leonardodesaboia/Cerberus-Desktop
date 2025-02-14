import React, { useState } from "react";
import { isValidEmail } from "../validations/MailValidation";
import "./editProfile.css";

const EditProfile = ({ currentName, currentEmail, onSave, onCancel }) => {
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);

  const handleSave = () => {
    if (!name.trim()) {
      alert("O nome não pode estar vazio.");
      return;
    }
    if (!isValidEmail(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }
    onSave(name, email);
  };

  return (
    <div className="edit-popup">
      <div className="popup-content">
        <h2 className="edit-title">Editar Perfil</h2>
        <div className="profile-info">
          <div className="info-group">
            <label>Nome</label>
            <input
              className="edit-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="info-group">
            <label>E-mail</label>
            <input
              className="edit-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>Salvar</button>
          <button className="cancel-btn" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
