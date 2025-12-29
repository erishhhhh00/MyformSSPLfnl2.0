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
                    background: radial-gradient(ellipse at center, #0f0a1f 0%, #050208 100%);
                    overflow: hidden;
                }

                /* Animated Background Gradient */
                .bg-glow {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
                    animation: bg-pulse 4s ease-in-out infinite;
                    pointer-events: none;
                }

                @keyframes bg-pulse {
                    0%, 100% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                }

                /* Floating Particles */
                .particle {
                    position: absolute;
                    border-radius: 50%;
                    animation: float-particle 10s linear infinite;
                    pointer-events: none;
                }

                @keyframes float-particle {
                    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }

                /* 3D Loader Container */
                .loader-3d-wrapper {
                    position: relative;
                    width: 220px;
                    height: 220px;
                    perspective: 1000px;
                    transform-style: preserve-3d;
                }

                /* Glassmorphism Backdrop */
                .glass-backdrop {
                    position: absolute;
                    inset: -20px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    animation: glass-rotate 20s linear infinite;
                }

                @keyframes glass-rotate {
                    from { transform: rotateZ(0deg); }
                    to { transform: rotateZ(360deg); }
                }

                /* Outer Ring - 3D Purple */
                .ring-outer {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 5px solid transparent;
                    border-top-color: #a855f7;
                    border-right-color: #8b5cf6;
                    animation: spin-3d-outer 2.5s linear infinite;
                    box-shadow: 
                        0 0 30px rgba(168, 85, 247, 0.6),
                        0 0 60px rgba(139, 92, 246, 0.4),
                        inset 0 0 20px rgba(168, 85, 247, 0.2);
                    transform-style: preserve-3d;
                }

                @keyframes spin-3d-outer {
                    0% { transform: rotateX(60deg) rotateY(0deg); }
                    100% { transform: rotateX(60deg) rotateY(360deg); }
                }

                /* Middle Ring - 3D Cyan */
                .ring-middle {
                    position: absolute;
                    inset: 30px;
                    border-radius: 50%;
                    border: 4px solid transparent;
                    border-top-color: #06b6d4;
                    border-left-color: #22d3ee;
                    animation: spin-3d-middle 2s linear infinite reverse;
                    box-shadow: 
                        0 0 25px rgba(6, 182, 212, 0.6),
                        0 0 50px rgba(34, 211, 238, 0.4),
                        inset 0 0 15px rgba(6, 182, 212, 0.2);
                    transform-style: preserve-3d;
                }

                @keyframes spin-3d-middle {
                    0% { transform: rotateX(-50deg) rotateZ(0deg); }
                    100% { transform: rotateX(-50deg) rotateZ(360deg); }
                }

                /* Inner Ring - 3D Pink */
                .ring-inner {
                    position: absolute;
                    inset: 55px;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-bottom-color: #ec4899;
                    border-right-color: #f472b6;
                    animation: spin-3d-inner 1.5s linear infinite;
                    box-shadow: 
                        0 0 20px rgba(236, 72, 153, 0.6),
                        0 0 40px rgba(244, 114, 182, 0.4),
                        inset 0 0 12px rgba(236, 72, 153, 0.2);
                    transform-style: preserve-3d;
                }

                @keyframes spin-3d-inner {
                    0% { transform: rotateY(70deg) rotateX(0deg); }
                    100% { transform: rotateY(70deg) rotateX(360deg); }
                }

                /* Core Glow Orb */
                .core-orb {
                    position: absolute;
                    inset: 70px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, 
                        rgba(168, 85, 247, 0.5) 0%, 
                        rgba(139, 92, 246, 0.3) 30%,
                        rgba(6, 182, 212, 0.2) 60%,
                        transparent 100%
                    );
                    box-shadow: 
                        0 0 60px rgba(139, 92, 246, 0.5),
                        0 0 100px rgba(6, 182, 212, 0.3),
                        inset 0 0 30px rgba(236, 72, 153, 0.2);
                    animation: orb-pulse 2s ease-in-out infinite;
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                }

                @keyframes orb-pulse {
                    0%, 100% { transform: scale(0.9); opacity: 0.7; }
                    50% { transform: scale(1.1); opacity: 1; }
                }

                /* Center Icon */
                .center-icon {
                    position: absolute;
                    inset: 75px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 38px;
                    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
                    animation: icon-bounce 1.5s ease-in-out infinite;
                    z-index: 10;
                }

                @keyframes icon-bounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-5px) scale(1.1); }
                }

                /* Loading Text */
                .loading-text {
                    margin-top: 40px;
                    font-size: 1.5rem;
                    font-weight: 600;
                    font-style: italic;
                    background: linear-gradient(90deg, #a855f7, #06b6d4, #ec4899, #a855f7);
                    background-size: 300% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: text-flow 3s linear infinite;
                    text-shadow: none;
                }

                @keyframes text-flow {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 300% 50%; }
                }

                /* Bouncing Dots */
                .dots-container {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    animation: dot-bounce 1.4s ease-in-out infinite;
                    box-shadow: 0 0 15px currentColor;
                }

                .dot:nth-child(1) { 
                    background: linear-gradient(135deg, #a855f7, #8b5cf6); 
                    animation-delay: 0s; 
                }
                .dot:nth-child(2) { 
                    background: linear-gradient(135deg, #06b6d4, #22d3ee); 
                    animation-delay: 0.2s; 
                }
                .dot:nth-child(3) { 
                    background: linear-gradient(135deg, #ec4899, #f472b6); 
                    animation-delay: 0.4s; 
                }

                @keyframes dot-bounce {
                    0%, 80%, 100% { transform: translateY(0) scale(1); }
                    40% { transform: translateY(-15px) scale(1.2); }
                }
            `}</style>

      {/* Background Glow */}
      <div className="bg-glow" />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            background: ['#a855f7', '#06b6d4', '#ec4899'][i % 3],
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
            boxShadow: `0 0 10px ${['#a855f7', '#06b6d4', '#ec4899'][i % 3]}`,
          }}
        />
      ))}

      {/* 3D Loader */}
      <div className="loader-3d-wrapper">
        <div className="glass-backdrop" />
        <div className="ring-outer" />
        <div className="ring-middle" />
        <div className="ring-inner" />
        <div className="core-orb" />
        <div className="center-icon">{getIcon()}</div>
      </div>

      {/* Loading Text */}
      <div className="loading-text">{getMessage()}</div>

      {/* Bouncing Dots */}
      <div className="dots-container">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
};

export default FuturisticLoader;
