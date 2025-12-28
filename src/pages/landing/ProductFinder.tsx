import React from 'react';
import './ProductFinder.css';

const ProductFinder: React.FC = () => {
  return (
    <section className="product-finder" aria-label="Product Finder">
      <div className="product-finder__wrap">
        {/* Using public folder path. Space encoded to ensure safe URL. */}
        <img
          src="/images/Product%20Finder.jpg"
          alt="Product Finder"
          className="product-finder__image"
          loading="eager"
          decoding="async"
        />
        {/* Single hotspot layer positioned via CSS variables (pixels) */}
        <div
          className="pf-layer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            // coordinates from user
            ['--x' as any]: '1168.0000000000005px',
            ['--y' as any]: '940.0000000000005px',
          }}
        >
          <div className="pf-dot" />
          {/* Second dot for the rope climber area (adjust as needed) */}
          <div className="pf-dot" style={{ left: '6%', top: '28.45%' }} />
          <div className="pf-dot" style={{ left: '87%', top: '7.45%' }} />
          <div className="pf-dot" style={{ left: '96%', top: '12%' }} />
          <div className="pf-dot" style={{ left: '23%', top: '76.45%' }} />
          <div className="pf-dot" style={{ left: '49.60%', top: '36.45%' }} />
          <div className="pf-dot" style={{ left: '88%', top: '64.45%' }} />
        </div>
      </div>
    </section>
  );
};

export default ProductFinder;


