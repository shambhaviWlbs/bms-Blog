import './ColdplayBlog.css';
import DraggableTicket from './DraggableTicket';
import React, { useEffect, useState } from 'react';
import TicketBoothAnimation from './TicketBoothAnimation';
import TicketHuntGame from './TicketHuntGame'

const ColdplayBlog = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [ticketsBurned, setTicketsBurned] = useState(0);

const handleTicketBurn = () => {
  setTicketsBurned(prev => prev + 1);
};
useEffect(() => {
  const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
      
      // Update classes for mobile view
      const heroSection = document.querySelector('.hero-section');
      const titleWrapper = document.querySelector('.title-wrapper');
      const contentContainer = document.querySelector('.content-container');
      
      if (isScrolled) {
          heroSection?.classList.add('scrolled');
          titleWrapper?.classList.add('scrolled');
          contentContainer?.classList.add('scrolled');
      } else {
          heroSection?.classList.remove('scrolled');
          titleWrapper?.classList.remove('scrolled');
          contentContainer?.classList.remove('scrolled');
      }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
  return (
    <div className="blog-container">
    <div className="fixed-background"></div>
    <div className="content-wrapper">
      <div className="hero-section">
        <div className={`hero-content ${scrolled ? 'scrolled' : ''}`}>
          <div className="animation-wrapper">
            <TicketBoothAnimation />
          </div>
          <div className="title-wrapper">
            <h1 className="main-title">When Coldplay Tickets Go Cold</h1>
            <h2 className="subtitle">Unpacking BookMyShow's Technical Meltdown</h2>
          </div>
        </div>
      </div>
      <TicketHuntGame onTicketBurn={handleTicketBurn} />
      <DraggableTicket scrolled={scrolled} />

        <div className={`main-content ${scrolled ? 'scrolled' : ''}`}>
        {/* Rest of your content sections remain the same */}
        <section className="content-section">
          <h3 className="section-title">Setting the Scene of the Coldplay Ticket Frenzy</h3>
          <p className="section-text">
            The BookMyShow ticket issue is a tale as old as time...
          </p>
        </section>

        {/* What Went Wrong Section */}
        <section className="content-section">
          <h3 className="section-title">The Ticket Release: What Went Wrong</h3>
          <div className="section-content">
            <div className="subsection">
              <h4 className="subsection-title">Underestimating the Demand</h4>
              <p className="section-text">
                BookMyShow seemed to have underestimated the sheer number of Coldplay enthusiasts ready to
                pounce on those tickets. The server capacity couldn't handle the massive traffic surge, resulting
                in crashes and slow loading times.
              </p>
            </div>
            <div className="subsection">
              <h4 className="subsection-title">Technical Glitches Galore</h4>
              <p className="section-text">
                From failed payment transactions to the infamous "ticket unavailable" messages that appeared
                after seats had been selected, the user experience was nothing short of a nightmare.
              </p>
            </div>
            <div className="subsection">
              <h4 className="subsection-title">User Interface Woes</h4>
              <p className="section-text">
              The BookMyShow ticket issue was further heightened by a clunky user interface that struggled under pressure. With confusing navigation and a lack of real-time updates, many users found it difficult to even get through the booking process, leading to widespread frustration and social media outcry.
              </p>
            </div>
            <div className="subsection">
              <h4 className="subsection-title">Lagging Behind in Technology</h4>
              <p className="section-text">
              To avoid such a bookmyshow ticket issue in the future, upgrading their technological infrastructure is imperative. Improving ticket sales website features like scalability, faster servers, and efficient load management are crucial steps BookMyShow must take to ensure a smoother experience for users. 
              </p>
            </div>
            <div className="subsection">
              <h4 className="subsection-title">Learning from Mistakes</h4>
              <p className="section-text">
              BookMyShow has a golden opportunity to learn from this coldplay ticket problem. By addressing the bookmyshow tech issue, enhancing their server capabilities, and refining their user interface, they can improve future ticket releases and regain the trust of their users. In the end, this BookMyShow ticket issue served as a stark reminder of the importance of robust technology in today's digital age. Improving ticket sales website functionalities will not only boost user satisfaction but also ensure that the next big event doesn't go cold due to technical failures.
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="content-section">
          <h3 className="section-title">How Can the Problem Be Solved?</h3>
          <div className="solutions-grid">
            {[
              {
                title: "Enhancing Server Capacity",
                text: "Investment in scalable server infrastructure to handle sudden surges in traffic."
              },
              {
                title: "Queue Systems",
                text: "Implementation of sophisticated virtual waiting rooms to control traffic influx."
              },
              {
                title: "User Experience",
                text: "Complete overhaul of the interface for a seamless booking process."
              },
              {
                title: "Testing",
                text: "Rigorous load testing and stress testing before major events."
              }
            ].map((solution, index) => (
              <div key={index} className="solution-item">
                <h4 className="subsection-title">{solution.title}</h4>
                <p className="section-text">{solution.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conclusion Section */}
        <section className="content-section">
          <h3 className="section-title">Conclusion</h3>
          <p className="section-text">
            The Coldplay ticket problem serves as a learning opportunity. By addressing these technical
            challenges head-on, BookMyShow and similar platforms can provide a more reliable service,
            ensuring fans can snag those coveted tickets without a hitch, making concert-going a joyous
            experience once again.
          </p>
        </section>
      </div>
    </div>
    </div>
  );
};

export default ColdplayBlog;