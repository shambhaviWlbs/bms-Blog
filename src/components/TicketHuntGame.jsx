import React, { useState, useEffect } from 'react';
import './TicketHuntGame.css'

const TicketHuntGame = ({ onTicketBurn }) => {
  // Previous state and scroll handling code remains the same
  const [tickets, setTickets] = useState([]);
  const [ticketsFound, setTicketsFound] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const hasScrolled = heroBottom < window.innerHeight;
        setHasScrolledPastHero(hasScrolled);
        if (hasScrolled && tickets.length === 0) {
          generateTickets();
          setShowAlert(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tickets.length]);

  const generateTickets = () => {
    const newTickets = [];
    const fixedPositions = [
      { top: '15%', left: '85%', transform: 'rotate(-15deg)', opacity: '0.02', scale: '0.7', zIndex: '10' },
      { top: '45%', left: '5%', transform: 'rotate(10deg)', opacity: '0.015', scale: '0.65', zIndex: '10' },
      { top: '75%', left: '92%', transform: 'rotate(-5deg)', opacity: '0.018', scale: '0.8', zIndex: '10' },
      { top: '88%', left: '25%', transform: 'rotate(8deg)', opacity: '0.012', scale: '0.75', zIndex: '10' },
      { top: '32%', left: '78%', transform: 'rotate(-12deg)', opacity: '0.016', scale: '0.7', zIndex: '10' },
      { top: '62%', left: '45%', transform: 'rotate(15deg)', opacity: '0.014', scale: '0.7', zIndex: '10' }
    ];

    for (let i = 0; i < 6; i++) {
      newTickets.push({
        id: i,
        found: false,
        position: fixedPositions[i],
        burning: false
      });
    }
    setTickets(newTickets);
  };

  const handleTicketBurn = (ticketId) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, found: true, burning: true } : ticket
    ));
    setTicketsFound(prev => prev + 1);
    onTicketBurn();
  };

  if (!hasScrolledPastHero) return null;

  return (
    <div className="relative">
      {showAlert && (
        <div className="fixed top-4 right-4 w-72 bg-black/80 border border-yellow-500 rounded-lg p-4 text-yellow-200 z-50 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              Find and burn all 6 hidden tickets! {ticketsFound}/6 found
            </div>
          </div>
        </div>
      )}
      
      {tickets.map(ticket => !ticket.found && (
        <DraggableTicket 
          key={ticket.id}
          id={ticket.id}
          initialPosition={ticket.position}
          onBurn={() => handleTicketBurn(ticket.id)}
        />
      ))}
    </div>
  );
};

const DraggableTicket = ({ id, initialPosition, onBurn }) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isBurning, setIsBurning] = useState(false);
  const [isNearFire, setIsNearFire] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFound, setIsFound] = useState(false);

  useEffect(() => {
    if (isHovered && !isFound) {
      setIsFound(true);
    }
  }, [isHovered]);

  const handleMouseDown = (e) => {
    if (!isBurning) {
      const rect = e.target.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setDragging(true);
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e) => {
    if (dragging && !isBurning) {
      const newPosition = {
        left: `${e.clientX - dragOffset.x}px`,
        top: `${e.clientY - dragOffset.y}px`
      };
      setPosition(newPosition);

      const fireElement = document.querySelector('.flame-container');
      if (fireElement) {
        const fireRect = fireElement.getBoundingClientRect();
        const ticketRect = document.getElementById(`ticket-${id}`).getBoundingClientRect();

        const proximity = 100;
        const isNear = Math.abs(ticketRect.left - fireRect.left) < proximity &&
                      Math.abs(ticketRect.top - fireRect.top) < proximity;
        setIsNearFire(isNear);

        if (isColliding(ticketRect, fireRect) && !isBurning) {
          startBurning();
        }
      }
    }
  };

  const startBurning = () => {
    setIsBurning(true);
    onBurn();
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const isColliding = (rect1, rect2) => {
    return !(rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const getOpacity = () => {
    if (dragging) return 1;
    if (isFound) return 0.9;
    if (isHovered) return 0.8;
    if (isNearFire) return 0.6;
    return position.opacity;
  };

  const getScale = () => {
    if (dragging) return 1.2;
    if (isFound) return 1.1;
    if (isHovered) return 1.15;
    return position.scale;
  };

  const getZIndex = () => {
    if (dragging || isHovered || isFound) return 50;
    return position.zIndex;
  };

  const getGlowStyle = () => {
    if (isFound) {
      return `
        0 0 10px rgba(255, 223, 0, 0.3),
        0 0 20px rgba(255, 223, 0, 0.2),
        0 0 30px rgba(255, 223, 0, 0.1)
      `;
    }
    return 'none';
  };

  return (
    <div
      id={`ticket-${id}`}
      className={`fixed select-none transition-all duration-300 pointer-events-auto
        ${dragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${isBurning ? 'burning' : ''}
        ${isNearFire ? 'near-fire' : ''}
        ${isFound ? 'found-ticket' : ''}`}
      style={{
        ...position,
        width: '100px',
        height: '50px',
        touchAction: 'none',
        transform: `${position.transform || ''} scale(${getScale()})`,
        opacity: getOpacity(),
        zIndex: getZIndex(),
        transition: isFound ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.3s ease',
        mixBlendMode: isFound ? 'normal' : 'multiply',
        filter: dragging || isFound ? 'none' : 'blur(0.5px)',
        backdropFilter: 'blur(2px)',
        boxShadow: getGlowStyle(),
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative w-full h-full rounded-lg shadow-sm overflow-hidden p-2 
        ${isFound ? 'bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 border-2 border-yellow-400' : 
        'bg-gradient-to-r from-yellow-100/30 via-yellow-200/30 to-yellow-100/30 border border-yellow-400/20'}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`border-b border-dashed ${isFound ? 'border-gray-700' : 'border-gray-700/30'} w-full mb-1`}></div>
          <span className={`font-bold text-xs mb-0.5 ${isFound ? 'text-gray-700' : 'text-gray-700/40'}`}>COLDPLAY</span>
          <div className={`border-t border-dashed ${isFound ? 'border-gray-700' : 'border-gray-700/30'} w-full mt-1`}></div>
        </div>
      </div>
    </div>
  );
};

export default TicketHuntGame;