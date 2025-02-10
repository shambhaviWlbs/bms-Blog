import React, { useState, useEffect, useCallback } from 'react';

const DraggableTicket = ({ scrolled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isBurning, setIsBurning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [burnProgress, setBurnProgress] = useState(0);
  const [particles, setParticles] = useState([]);
  const [embers, setEmbers] = useState([]);

  const createEmber = useCallback(() => ({
    id: Math.random(),
    left: Math.random() * 100,
    top: Math.random() * 100,
    xOffset: Math.random() * 120 - 60, // Increased range for wider spread
    rotation: Math.random() * 720 - 360, // Full rotation range
    delay: Math.random() * 0.8, // Increased delay for more natural effect
    size: 2 + Math.random() * 2, // Variable ember sizes
  }), []);

  const createParticles = useCallback(() => {
    const particleCount = 30; // Increased particle count
    const newParticles = Array.from({ length: particleCount }, () => ({
      id: Math.random(),
      left: Math.random() * 100 + '%',
      delay: Math.random() * 0.8,
      angle: Math.random() * 360,
      speed: 1.5 + Math.random() * 2.5, // Increased speed variation
      size: 3 + Math.random() * 3 // Variable particle sizes
    }));
    setParticles(newParticles);
  }, []);

  const handleDragStart = (e) => {
    if (isBurning) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    setStartPos({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
    setIsDragging(true);
  };

  const handleDrag = (e) => {
    if (!isDragging || isBurning) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    setPosition({
      x: touch.clientX - startPos.x,
      y: touch.clientY - startPos.y
    });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const flameContainer = document.querySelector('.flame-container');
    if (flameContainer) {
      const flameRect = flameContainer.getBoundingClientRect();
      const ticketElem = document.querySelector('.draggable-ticket');
      const ticketRect = ticketElem.getBoundingClientRect();

      if (
        ticketRect.left < flameRect.right &&
        ticketRect.right > flameRect.left &&
        ticketRect.top < flameRect.bottom &&
        ticketRect.bottom > flameRect.top
      ) {
        startBurningAnimation();
      }
    }
  };

  const startBurningAnimation = () => {
    setIsBurning(true);
    createParticles();
    setEmbers(Array.from({ length: 15 }, createEmber)); // Increased initial embers
    
    const burnInterval = setInterval(() => {
      setBurnProgress(prev => {
        if (prev >= 100) {
          clearInterval(burnInterval);
          return prev;
        }
        if (prev % 15 === 0) { // More frequent ember generation
          setEmbers(prev => [...prev, ...Array.from({ length: 8 }, createEmber)]);
        }
        return prev + 1;
      });
    }, 20);

    setTimeout(() => {
      setIsVisible(false);
      const boothAnimation = document.querySelector('.flame-container');
      if (boothAnimation) {
        const burnEvent = new CustomEvent('ticketBurn', {
          detail: { text: 'COLDPLAY', className: 'text-yellow-300' }
        });
        boothAnimation.dispatchEvent(burnEvent);
      }
    }, 2500);
  };

  useEffect(() => {
    if (scrolled) {
      setIsVisible(false);
    } else if (!isBurning) {
      setIsVisible(true);
    }
  }, [scrolled, isBurning]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleDrag(e);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  if (!isVisible) return null;

  const getBurnStyles = () => {
    const progress = burnProgress / 100;
    const corners = [
      { x: progress * 25, y: progress * 20 }, // Adjusted corner positions
      { x: 100 - progress * 20, y: progress * 30 },
      { x: 100 - progress * 25, y: 100 - progress * 20 },
      { x: progress * 20, y: 100 - progress * 25 }
    ];
    
    return {
      '--corner1-x': `${corners[0].x}%`,
      '--corner1-y': `${corners[0].y}%`,
      '--corner2-x': `${corners[1].x}%`,
      '--corner2-y': `${corners[1].y}%`,
      '--corner3-x': `${corners[2].x}%`,
      '--corner3-y': `${corners[2].y}%`,
      '--corner4-x': `${corners[3].x}%`,
      '--corner4-y': `${corners[3].y}%`,
    };
  };

  const getTicketStyle = () => {
    const baseStyle = {
      width: '200px',
      height: '100px',
      left: 'calc(50% - 100px)',
      top: scrolled ? '50%' : '300px',
    };

    const transformStyle = `translate(${position.x}px, ${position.y}px)`;
    
    if (isBurning) {
      return {
        ...baseStyle,
        transform: `${transformStyle} scale(${0.95 + (burnProgress / 800)}) rotate(${burnProgress / 15}deg)`,
        transition: 'transform 0.3s ease-out',
      };
    }

    return {
      ...baseStyle,
      transform: transformStyle,
      transition: 'all 0.3s ease',
    };
  };

  return (
    <div
      className={`fixed z-50 cursor-grab active:cursor-grabbing draggable-ticket ${
        isBurning ? 'disintegrating' : ''
      }`}
      style={getTicketStyle()}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onTouchMove={handleDrag}
      onTouchEnd={handleDragEnd}
    >
      <div 
        className={`relative w-full h-full bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 
          rounded-lg shadow-xl overflow-hidden p-4 ${isBurning ? 'ticket-burn-effect' : ''}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="border-b-2 border-dashed border-gray-700 w-full mb-2"></div>
          <span className="text-gray-700 font-bold mb-1">COLDPLAY</span>
          <span className="text-sm text-gray-600">Drag to burn!</span>
          <div className="border-t-2 border-dashed border-gray-700 w-full mt-2"></div>
        </div>
        
        {isBurning && (
          <>
            <div className="burning-overlay" />
            
            <div 
              className="burning-edges"
              style={getBurnStyles()}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 via-red-500/20 to-transparent" />
            </div>

            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`char-${i}`}
                className="char-line"
                style={{
                  top: `${15 + i * 12}%`,
                  width: `${Math.max(0, burnProgress - i * 15)}%`,
                  opacity: 0.4,
                }}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-red-500 to-transparent animate-burn opacity-60" />
            
            {particles.map(particle => (
              <div
                key={particle.id}
                className="burning-particle"
                style={{
                  left: particle.left,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  animationDelay: `${particle.delay}s`,
                  transform: `rotate(${particle.angle}deg)`,
                  animationDuration: `${particle.speed}s`
                }}
              />
            ))}

            {embers.map(ember => (
              <div
                key={ember.id}
                className="ember"
                style={{
                  left: `${ember.left}%`,
                  top: `${ember.top}%`,
                  width: `${ember.size}px`,
                  height: `${ember.size}px`,
                  '--x-offset': `${ember.xOffset}px`,
                  '--rotation': `${ember.rotation}deg`,
                  animationDelay: `${ember.delay}s`,
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DraggableTicket;