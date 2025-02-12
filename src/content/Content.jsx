import React from 'react'
import './content.css'
const Content = () => {
  return (
    <div>
      {/* Seção de pontos */}
      <div className="points-section">
        <div className="points-label">Seu saldo de pontos</div>
        <div className="points-value">98</div>
      </div>

      {/* Seção de conquistas */}
      <div className='achievements'>
        <h1>Suas Conquistas</h1>
        <div className='achievements-container'>
          <div className="card achievement-card">
            <img src="trophy.png" alt="Troféu" />
            <p>10 metais descartados</p>
          </div>
        </div>
      </div>

      {/* Seção de conquistas bloqueadas */}
      <div className='achievements-block'>
        <h1>Conquistas Bloqueadas</h1>
        <div className='achievements-container'>
          <div className="card blocked-card">
            <img src="locked-trophy.png" alt="Trofeu Bloqueado" />
            <p>Descarte 10 plásticos</p>
          </div>
        </div>
      </div>

      {/* Dashboard (seção vazia por enquanto) */}
      <div className='dashboard'>
        <div></div>
      </div>
    </div>
  )
}

export default Content
