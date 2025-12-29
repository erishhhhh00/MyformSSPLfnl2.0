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
          background: radial-gradient(ellipse at center, rgba(10, 10, 30, 0.95) 0%, rgba(5, 5, 20, 0.98) 100%);
          backdrop-filter: blur(20px);
        }

        /* Floating particles */
        .particles-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          animation: floatParticle 8s infinite ease-in-out;
        }

        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }

        /* 3D Loader Container */
        .loader-3d-container {
          position: relative;
          width: 200px;
          height: 200px;
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        /* Outer Ring */
        .ring-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #8b5cf6;
          border-right-color: #06b6d4;
          animation: rotateOuter 2s linear infinite;
          box-shadow: 
            0 0 30px rgba(139, 92, 246, 0.5),
            0 0 60px rgba(139, 92, 246, 0.3),
            inset 0 0 30px rgba(139, 92, 246, 0.1);
          transform-style: preserve-3d;
        }

        @keyframes rotateOuter {
          0% {
            transform: rotateX(35deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(35deg) rotateY(360deg);
          }
        }

        /* Middle Ring */
        .ring-middle {
          position: absolute;
          inset: 20px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #06b6d4;
          border-left-color: #ec4899;
          animation: rotateMiddle 1.5s linear infinite reverse;
          box-shadow: 
            0 0 25px rgba(6, 182, 212, 0.5),
            0 0 50px rgba(6, 182, 212, 0.3),
            inset 0 0 25px rgba(6, 182, 212, 0.1);
          transform-style: preserve-3d;
        }

        @keyframes rotateMiddle {
          0% {
            transform: rotateX(-25deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(-25deg) rotateZ(360deg);
          }
        }

        /* Inner Ring */
        .ring-inner {
          position: absolute;
          inset: 40px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-bottom-color: #ec4899;
          border-right-color: #8b5cf6;
          animation: rotateInner 1s linear infinite;
          box-shadow: 
            0 0 20px rgba(236, 72, 153, 0.5),
            0 0 40px rgba(236, 72, 153, 0.3),
            inset 0 0 20px rgba(236, 72, 153, 0.1);
          transform-style: preserve-3d;
        }

        @keyframes rotateInner {
          0% {
            transform: rotateY(45deg) rotateX(0deg);
          }
          100% {
            transform: rotateY(45deg) rotateX(360deg);
          }
        }

        /* Core Glow */
        .core-glow {
          position: absolute;
          inset: 60px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(139, 92, 246, 0.4) 0%, 
            rgba(6, 182, 212, 0.2) 50%, 
            transparent 70%
          );
          animation: pulseCore 2s ease-in-out infinite;
          box-shadow: 
            0 0 60px rgba(139, 92, 246, 0.6),
            0 0 100px rgba(6, 182, 212, 0.4);
        }

        @keyframes pulseCore {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        /* Center Icon */
        .center-icon {
          position: absolute;
          inset: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
          text-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
          animation: iconPulse 1.5s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.1);
            filter: brightness(1.3);
          }
        }

        /* Loading Text */
        .loading-text {
          margin-top: 40px;
          font-size: 1.5rem;
          font-weight: 600;
          background: linear-gradient(90deg, #8b5cf6, #06b6d4, #ec4899, #8b5cf6);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientFlow 2s linear infinite;
          text-shadow: none;
        }

        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }

        /* Loading Dots */
        .loading-dots {
          display: flex;
          gap: 8px;
          margin-top: 20px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          animation: dotBounce 1.4s ease-in-out infinite;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.6);
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-15px) scale(1.2);
          }
        }

        /* Glassmorphism card behind loader */
        .glass-backdrop {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 
            inset 0 0 50px rgba(139, 92, 246, 0.1),
            0 0 80px rgba(6, 182, 212, 0.1);
        }
      `}</style>

            {/* Floating Particles */}
            <div className="particles-container">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${6 + Math.random() * 4}s`,
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                        }}
                    />
                ))}
            </div>

            {/* Glass Backdrop */}
            <div className="glass-backdrop"></div>

            {/* 3D Loader */}
            <div className="loader-3d-container">
                <div className="ring-outer"></div>
                <div className="ring-middle"></div>
                <div className="ring-inner"></div>
                <div className="core-glow"></div>
                <div className="center-icon">
                    {type === 'login' ? '🔐' : type === 'logout' ? '👋' : '⚡'}
                </div>
            </div>

            {/* Loading Text */}
            <div className="loading-text">{getMessage()}</div>

            {/* Bouncing Dots */}
            <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    );
};

export default FuturisticLoader;
