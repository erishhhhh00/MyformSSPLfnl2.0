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
    <div className="loader-overlay">
      <style>{`
                .loader-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 50%, #16213e 100%);
                }

                /* Main Loader Container */
                .loader-container {
                    position: relative;
                    width: 150px;
                    height: 150px;
                }

                /* Spinning Circle 1 - Outer */
                .spinner-1 {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 4px solid transparent;
                    border-top: 4px solid #8b5cf6;
                    animation: spin 1.5s linear infinite;
                }

                /* Spinning Circle 2 - Middle */
                .spinner-2 {
                    position: absolute;
                    inset: 15px;
                    border-radius: 50%;
                    border: 4px solid transparent;
                    border-top: 4px solid #06b6d4;
                    border-right: 4px solid #06b6d4;
                    animation: spin 1s linear infinite reverse;
                }

                /* Spinning Circle 3 - Inner */
                .spinner-3 {
                    position: absolute;
                    inset: 30px;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-top: 3px solid #ec4899;
                    border-left: 3px solid #ec4899;
                    animation: spin 0.8s linear infinite;
                }

                /* Center Circle with Icon */
                .center-circle {
                    position: absolute;
                    inset: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 
                        0 0 30px rgba(139, 92, 246, 0.5),
                        0 0 60px rgba(6, 182, 212, 0.3),
                        inset 0 0 20px rgba(236, 72, 153, 0.2);
                    animation: pulse 2s ease-in-out infinite;
                }

                .icon {
                    font-size: 32px;
                    filter: drop-shadow(0 0 10px white);
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(6, 182, 212, 0.3); }
                    50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(139, 92, 246, 0.7), 0 0 80px rgba(6, 182, 212, 0.5); }
                }

                /* Glow Effect Behind Loader */
                .glow-bg {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
                    animation: glow-pulse 3s ease-in-out infinite;
                }

                @keyframes glow-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.3); opacity: 0.8; }
                }

                /* Text */
                .loader-text {
                    margin-top: 40px;
                    font-size: 1.3rem;
                    font-weight: 500;
                    color: #e2e8f0;
                    letter-spacing: 2px;
                    animation: text-fade 2s ease-in-out infinite;
                }

                @keyframes text-fade {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }

                /* Dots */
                .dots-row {
                    display: flex;
                    gap: 8px;
                    margin-top: 15px;
                }

                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    animation: dot-jump 1.4s ease-in-out infinite;
                }

                .dot:nth-child(1) { background: #8b5cf6; animation-delay: 0s; }
                .dot:nth-child(2) { background: #06b6d4; animation-delay: 0.2s; }
                .dot:nth-child(3) { background: #ec4899; animation-delay: 0.4s; }

                @keyframes dot-jump {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>

      {/* Background Glow */}
      <div className="glow-bg" />

      {/* Loader */}
      <div className="loader-container">
        <div className="spinner-1" />
        <div className="spinner-2" />
        <div className="spinner-3" />
        <div className="center-circle">
          <span className="icon">{getIcon()}</span>
        </div>
      </div>

      {/* Text */}
      <div className="loader-text">{getMessage()}</div>

      {/* Dots */}
      <div className="dots-row">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
};

export default FuturisticLoader;
