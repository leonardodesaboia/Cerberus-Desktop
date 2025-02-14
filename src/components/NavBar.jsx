import React, { useState, useEffect } from "react";
import EditProfile from "../profile/EditProfile";
import { getUserData, editUserData } from "../services/edit";
import "./navbar.css";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSaveClick = async (newName, newEmail) => {
    try {
      const updatedUser = await editUserData({ name: newName, email: newEmail });
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="brand">
          <h1>Cerberus</h1>
        </div>
        {user && (
          <div className="welcome">
            <span className="welcome-text">Bem-vindo(a),</span>
            <span className="user-name">{user.name}</span>
          </div>
        )}
        <div className="profile-container">
          <div className="profile-icon" onClick={() => setIsEditing(true)}>
            <img src="/user.svg" alt="User" />
          </div>
        </div>
      </nav>

      {isEditing && user && (
        <EditProfile
          currentName={user.name}
          currentEmail={user.email}
          onSave={handleSaveClick}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default NavBar;
