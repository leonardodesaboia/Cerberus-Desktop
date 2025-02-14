import { Leaf, Recycle, Gift, Smartphone } from "lucide-react";
import "../styles/Features.css";

const Features = () => {
  const features = [
    {
      icon: <Recycle className="h-8 w-8" />,
      title: "Reciclagem Inteligente",
      description: "Descarte seus resíduos nos totens inteligentes e ganhe pontos automaticamente"
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Recompensas Exclusivas",
      description: "Troque seus pontos por produtos, serviços e descontos em estabelecimentos parceiros"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "App Integrado",
      description: "Acompanhe seus pontos, histórico de reciclagem e recompensas disponíveis"
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Impacto Ambiental",
      description: "Visualize sua contribuição para um mundo mais sustentável"
    }
  ];

  return (
    <section id="como-funciona" className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Como Funciona</h2>
          <p className="features-description">
            Nosso sistema de reciclagem inteligente torna fácil e recompensador contribuir para um mundo mais sustentável
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">
                {feature.title}
              </h3>
              <p className="feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="features-cta">
          <h3 className="features-cta-title">
            Comece sua jornada sustentável hoje mesmo
          </h3>
          <button className="features-cta-button">
            Criar Conta Grátis
            <Leaf className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;