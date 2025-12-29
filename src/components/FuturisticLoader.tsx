import React from 'react';

interface FuturisticLoaderProps {
  text?: string;
  type?: 'login' | 'logout' | 'loading';
}

const FuturisticLoader: React.FC<FuturisticLoaderProps> = ({
  text = 'Loading...',
  type = 'loading'
}) => {
  const getMessage = () => {
    switch (type) {
      case 'login':
        return 'Signing In...';
      case 'logout':
        return 'Signing Out...';
      default:
        return text;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'login':
        return '🔐';
      case 'logout':
        return '👋';
      default:
        return '⚡';
    }
  };

  return (
    <div className="futuristic-loader-overlay">
      <style>{`
                .futuristic-loader-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #0a0a12;
                    overflow: hidden;
                }

                /* Floating Particles */
                .particle {
                    position: absolute;
                    border-radius: 50%;
                    animation: float-up 12s linear infinite;
                    pointer-events: none;
                }

                @keyframes float-up {
                    0% { transform: translateY(100vh); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh); opacity: 0; }
                }

                /* 3D Loader Container */
                .loader-wrapper {
                    position: relative;
                    width: 200px;
                    height: 200px;
                    perspective: 800px;
                }

                /* Ring Base Style */
                .ring {
                    position: absolute;
                    border-radius: 50%;
                    border-style: solid;
                    border-color: transparent;
                }

                /* Outer Ring - PURPLE - Clear & Bright */
                .ring-1 {
                    inset: 0;
                    border-width: 4px;
                    border-top-color: #c084fc;
                    border-right-color: #a855f7;
                    animation: spin-1 3s linear infinite;
                    filter: drop-shadow(0 0 12px #a855f7);
                }

                @keyframes spin-1 {
                    from { transform: rotateX(70deg) rotateZ(0deg); }
                    to { transform: rotateX(70deg) rotateZ(360deg); }
                }

                /* Second Ring - CYAN - Clear & Bright */
                .ring-2 {
                    inset: 25px;
                    border-width: 4px;
                    border-top-color: #22d3ee;
                    border-left-color: #06b6d4;
                    animation: spin-2 2.5s linear infinite reverse;
                    filter: drop-shadow(0 0 12px #06b6d4);
                }

                @keyframes spin-2 {
                    from { transform: rotateX(-60deg) rotateZ(0deg); }
                    to { transform: rotateX(-60deg) rotateZ(360deg); }
                }

                /* Third Ring - PINK - Clear & Bright */
                .ring-3 {
                    inset: 50px;
                    border-width: 3px;
                    border-bottom-color: #f472b6;
                    border-right-color: #ec4899;
                    animation: spin-3 2s linear infinite;
                    filter: drop-shadow(0 0 10px #ec4899);
                }

                @keyframes spin-3 {
                    from { transform: rotateY(60deg) rotateX(0deg); }
                    to { transform: rotateY(60deg) rotateX(360deg); }
                }

                /* Center Icon Container */
                .icon-container {
                    position: absolute;
                    inset: 65px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
                }

                .center-icon {
                    font-size: 42px;
                    animation: icon-pulse 1.5s ease-in-out infinite;
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
                }

                @keyframes icon-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }

                /* Loading Text */
                .loading-text {
                    margin-top: 35px;
                    font-size: 1.4rem;
                    font-weight: 600;
                    background: linear-gradient(90deg, #c084fc, #22d3ee, #f472b6, #c084fc);
                    background-size: 300% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: text-shimmer 2s linear infinite;
                }

                @keyframes text-shimmer {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 300% 50%; }
                }

                /* Bouncing Dots */
                .dots {
                    display: flex;
                    gap: 10px;
                    margin-top: 18px;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    animation: bounce 1.4s ease-in-out infinite;
                }

                .dot-1 { background: #c084fc; animation-delay: 0s; box-shadow: 0 0 10px #c084fc; }
                .dot-2 { background: #22d3ee; animation-delay: 0.2s; box-shadow: 0 0 10px #22d3ee; }
                .dot-3 { background: #f472b6; animation-delay: 0.4s; box-shadow: 0 0 10px #f472b6; }

                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-12px); }
                }
            `}</style>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
            background: ['#c084fc', '#22d3ee', '#f472b6'][i % 3],
            boxShadow: `0 0 8px ${['#c084fc', '#22d3ee', '#f472b6'][i % 3]}`,
            animationDelay: `${Math.random() * 12}s`,
            animationDuration: `${10 + Math.random() * 5}s`,
          }}
        />
      ))}

      {/* 3D Rings */}
      <div className="loader-wrapper">
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        <div className="icon-container">
          <span className="center-icon">{getIcon()}</span>
        </div>
      </div>

      {/* Text */}
      <div className="loading-text">{getMessage()}</div>

      {/* Dots */}
      <div className="dots">
        <div className="dot dot-1" />
        <div className="dot dot-2" />
        <div className="dot dot-3" />
      </div>
    </div>
  );
};

export default FuturisticLoader;
