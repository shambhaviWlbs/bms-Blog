import React, { useEffect, useRef, useState } from 'react';
import './TicketBoothAnimation.css';

const TicketBoothAnimation = () => {
  const [particles, setParticles] = useState([]);
  const [currentImageSet, setCurrentImageSet] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const frameRef = useRef(0);
  const boothRef = useRef(null);

  const ticketTypes = [
    { text: "VIP", className: "text-yellow-300" },
    { text: "🎟️", className: "text-white" },
    { text: "ADMIT ONE", className: "text-amber-200" },
    { text: "GOLDEN", className: "text-yellow-400" },
    { text: "★ PASS ★", className: "text-orange-300" }
  ];

  const flameSets = [
    Array.from({ length: 5 }, (_, i) => `/images/flame${i + 1}.svg`),
    Array.from({ length: 5 }, (_, i) => `/images/blueflame${i + 1}.svg`),
    Array.from({ length: 5 }, (_, i) => `/images/purpleflame${i + 1}.svg`),
  ];
  useEffect(() => {
    const flameContainer = document.querySelector('.flame-container');
    
    const handleTicketBurn = (event) => {
      setBurningTickets(prev => [
        ...prev,
        {
          id: Math.random(),
          text: event.detail.text,
          className: event.detail.className,
          x: Math.random() * 70 + 15,
          y: Math.random() * 60 + 20,
          scale: Math.random() * 0.5 + 0.7,
          duration: Math.random() * 2 + 2,
          rotation: Math.random() * 20 - 10,
        }
      ]);
    };
  
    if (flameContainer) {
      flameContainer.addEventListener('ticketBurn', handleTicketBurn);
    }
  
    return () => {
      if (flameContainer) {
        flameContainer.removeEventListener('ticketBurn', handleTicketBurn);
      }
    };
  }, []);
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 5);
    }, 150);
    return () => clearInterval(frameInterval);
  }, []);

  const createTicket = () => {
    const ticket = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
    return {
      id: Math.random(),
      ...ticket,
      x: Math.random() * 70 + 15,
      y: Math.random() * 60 + 20,
      scale: Math.random() * 0.5 + 0.7,
      duration: Math.random() * 2 + 2,
      rotation: Math.random() * 20 - 10,
    };
  };

  const [burningTickets, setBurningTickets] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBurningTickets(prev => [...prev.filter((_, i) => i < 4), createTicket()]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let lastScrollTime = Date.now();
    let scrollTimeout;
  
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTime;
  
      if (timeDiff === 0) return;
  
      const velocity = Math.abs(currentScroll - lastScrollY.current) / timeDiff;
      setScrollVelocity(velocity * 100);
  
      lastScrollY.current = currentScroll;
      lastScrollTime = currentTime;
  
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollVelocity(0);
      }, 150);
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
  
  useEffect(() => {
    let animationInterval;
  
    if (scrollVelocity > 0) {
      animationInterval = setInterval(() => {
        setCurrentImageSet(prev => (prev + 1) % flameSets.length);
      }, 150);
    } else {
      setCurrentImageSet(0);
    }
  
    return () => clearInterval(animationInterval);
  }, [scrollVelocity]);

  const fireScale = Math.min(1.2, 1 + scrollVelocity * 0.3);
  const fireOpacity = Math.min(1, 0.6 + scrollVelocity * 0.2);
  const fireIntensity = 1 + Math.min(scrollVelocity * 0.5, 0.5);

  return (
    <div className="ticket-booth-container">
      <div ref={boothRef} className="ticket-booth">
        {/* Decorative Top */}
        <div className="booth-top">
          <div className="booth-crown"></div>
        </div>

        {/* Ticket Banner */}
        <div className="ticket-banner">
          <div className="banner-text">TICKETS</div>
        </div>

        {/* Main Booth Structure */}
        <div className="booth-body">
          {/* Left Column Details */}
          <div className="booth-column booth-column-left">
            <div className="column-detail"></div>
            <div className="column-detail"></div>
            <div className="column-detail"></div>
          </div>

          {/* Center Window */}
          <div className="booth-window-frame">
            <div className="window-top-detail"></div>
            <div className="booth-window">
              <div className="window-glass">
                <div className="flame-container" style={{
                  transform: `scale(${fireScale})`,
                  transition: 'transform 0.3s ease-out'
                }}>
                  {flameSets[currentImageSet].map((_, index) => (
                    <img key={index} src={flameSets[currentImageSet][currentFrame]} alt="flame"
                      className="flame-image" style={{
                        opacity: index === currentFrame ? fireOpacity : 0,
                        filter: `brightness(${fireIntensity})`,
                        transition: "opacity 0.15s ease-out"
                      }} />
                  ))}
                  {burningTickets.map(ticket => (
                    <div key={ticket.id} className={`burning-ticket ${ticket.className}`} style={{
                      left: `${ticket.x}%`, top: `${ticket.y}%`,
                      transform: `translate(-50%, -50%) scale(${ticket.scale}) rotate(${ticket.rotation}deg)`,
                      animation: `ticketBurn ${ticket.duration}s ease-in-out infinite`
                    }}>
                      {ticket.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="window-ledge"></div>
            </div>
          </div>

          {/* Right Column Details */}
          <div className="booth-column booth-column-right">
            <div className="column-detail"></div>
            <div className="column-detail"></div>
            <div className="column-detail"></div>
          </div>
        </div>

        {/* Booth Base */}
        <div className="booth-base">
          <div className="base-detail"></div>
        </div>
      </div>
    </div>
  );
};

export default TicketBoothAnimation;