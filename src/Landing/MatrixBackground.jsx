import React from 'react';

const MatrixBackground = () => {
  return (
    <div className="matrix-bg">
      {/* UN SOLO CUBO GRANDE GIRATORIO */}
     <div className="single-cube-container">
  <div className="main-cube">
    <div className="face front"></div>
    <div className="face back"></div>
    <div className="face right"></div>
    <div className="face left"></div>
    <div className="face top"></div>
    <div className="face bottom"></div>
  </div>
</div>

      
    
      {/* Fórmulas matemáticas flotantes */}
      <div className="formula-container">
        <div className="formula formula-1">f(x) = ax² + bx + c</div>
        <div className="formula formula-2">∑(x₁ + x₂ + ... + xₙ)</div>
        <div className="formula formula-3">∫ f(x)dx</div>
        <div className="formula formula-4">lim x→∞</div>
        <div className="formula formula-5">√(a² + b²)</div>
        <div className="formula formula-6">e^(iπ) + 1 = 0</div>
      </div>
       
      {/* Cuadrados y formas geométricas */}
      <div className="geometric-shapes">
        <div className="shape square-1"></div>
        <div className="shape square-2"></div>
        <div className="shape square-3"></div>
        <div className="shape square-4"></div>
        <div className="shape square-5"></div>
        <div className="shape square-6"></div>
        <div className="shape circle-1"></div>
        <div className="shape circle-2"></div>
        <div className="shape triangle-1"></div>
        <div className="shape triangle-2"></div>
      </div>

      {/* Líneas de conexión animadas */}
      <div className="connection-lines">
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
        <div className="line line-4"></div>
      </div>

      {/* Partículas flotantes */}
      <div className="particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
        <div className="particle particle-7"></div>
        <div className="particle particle-8"></div>
      </div>
    </div>
  );
};

export default MatrixBackground;