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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)'
    }}>
      <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.6; transform: scale(0.95); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                @keyframes float-up {
                    0% { transform: translateY(100vh); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { transform: translateY(-100vh); opacity: 0; }
                }
                @keyframes text-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes bounce-dot {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-12px); }
                }
            `}</style>

      {/* Floating Particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#06b6d4' : '#ec4899',
              animation: `float-up ${8 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Loader Container */}
      <div style={{ position: 'relative', width: '180px', height: '180px' }}>

        {/* Outer Ring - Purple/Violet */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '4px solid transparent',
          borderTopColor: '#8b5cf6',
          borderRightColor: '#a855f7',
          animation: 'spin-slow 2s linear infinite',
          filter: 'drop-shadow(0 0 8px #8b5cf6)'
        }} />

        {/* Middle Ring - Cyan/Teal */}
        <div style={{
          position: 'absolute',
          inset: '25px',
          borderRadius: '50%',
          border: '4px solid transparent',
          borderTopColor: '#06b6d4',
          borderLeftColor: '#14b8a6',
          animation: 'spin-reverse 1.5s linear infinite',
          filter: 'drop-shadow(0 0 8px #06b6d4)'
        }} />

        {/* Inner Ring - Pink/Magenta */}
        <div style={{
          position: 'absolute',
          inset: '50px',
          borderRadius: '50%',
          border: '3px solid transparent',
          borderBottomColor: '#ec4899',
          borderRightColor: '#f472b6',
          animation: 'spin-slow 1s linear infinite',
          filter: 'drop-shadow(0 0 8px #ec4899)'
        }} />

        {/* Center Icon */}
        <div style={{
          position: 'absolute',
          inset: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          animation: 'pulse-glow 2s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '36px' }}>{getIcon()}</span>
        </div>
      </div>

      {/* Loading Text */}
      <div style={{
        marginTop: '30px',
        fontSize: '1.4rem',
        fontWeight: 600,
        background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #ec4899, #8b5cf6)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'text-shimmer 2s linear infinite'
      }}>
        {getMessage()}
      </div>

      {/* Bouncing Dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: i === 0 ? '#8b5cf6' : i === 1 ? '#06b6d4' : '#ec4899',
              animation: `bounce-dot 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FuturisticLoader;
