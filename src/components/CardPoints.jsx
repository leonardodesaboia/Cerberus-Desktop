import { useState, useEffect } from "react";
import { getUserData } from "../services/api";
import '../styles/cardPoints.css';

const CardPoints = () => {
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [username, setUserName] = useState("")

// Carregar pontos do usuário
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserData();
                setUserName(userData.username)
                setPoints(userData.points);
            } catch (err) {
                console.error("Erro ao carregar dados do usuário", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
      <div className="welcome-container">
        <h1 className="welcome-text">Bem Vindo(a), {username}!</h1>
        <div className="points-card">
            <section>
                <p className="points-label">Seus pontos acumulados:</p>
                <p className="points-value animated-float">{points}</p>
            </section>
            <img src="./coin.png" alt="pontos" className="coin-points" />
        </div>
      </div>
    );
};

export default CardPoints;