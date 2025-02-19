import { Award, Zap, ShieldCheck, TreeDeciduous, Lightbulb } from "lucide-react";
import "../styles/Hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-bg" />
      
      <div className="hero-content">
        <div className="hero-main">
          <div className="hero-tag">
            <Award className="h-5 w-5" />
            Transforme resíduos em recompensas
          </div>
          
          <h1 className="hero-title">
            Recicle de forma inteligente,
            <br className="hide-mobile" />
            ganhe recompensas reais
          </h1>
          
          <p className="hero-description">
            Junte-se à revolução verde e transforme seus resíduos em pontos que podem ser trocados por produtos, serviços e muito mais.
          </p>
        </div>

        <div className="hero-showcase">
          <div className="showcase-item">
            <div className="showcase-icon">
              <Zap className="h-6 w-6" style={{ color: "black" }} />
            </div>
            <div className="showcase-content">
              <h3 className="showcase-title">Tecnologia Avançada</h3>
              <p className="showcase-description">
                Nossos totens inteligentes identificam e classificam automaticamente seus resíduos
              </p>
            </div>
          </div>

          <div className="showcase-item">
            <div className="showcase-icon">
              <ShieldCheck style={{ color: "black" }}/>
            </div>
            <div className="showcase-content">
              <h3 className="showcase-title">100% Seguro</h3>
              <p className="showcase-description">
                Sistema protegido e certificado para garantir suas recompensas
              </p>
            </div>
          </div>

          <div className="showcase-item">
            <div className="showcase-icon">
              <TreeDeciduous style={{ color: "black" }} />
            </div>
            <div className="showcase-content">
              <h3 className="showcase-title">Impacto Real</h3>
              <p className="showcase-description">
                Acompanhe sua contribuição para um planeta mais sustentável
              </p>
            </div>
          </div>

          <div className="showcase-item">
            <div className="showcase-icon">
              <Lightbulb style={{ color: "black" }} />
            </div>
            <div className="showcase-content">
              <h3 className="showcase-title">Educação Ambiental</h3>
              <p className="showcase-description">
                Aprenda sobre reciclagem e sustentabilidade enquanto ganha pontos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;