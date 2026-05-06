import './App.css';

function App() {
  return (
    <main className="portfolio-wrapper">
      {/* Left Side: Image & Bio */}
      <section className="left-column">
        <div className="hero-img-container">
          <img src="/Orange.jpg" alt="Sandra" className="hero-img" />
        </div>
        
        <div className="left-top">
          <h1 className="brand-name">SANDRA</h1>
        </div>

        <div className="left-bottom">
          <h2 className="bio-title">Hello, I'm Sandra.</h2>
          <p className="bio-text">
            I build my ideas, help others to shape theirs, and talk about everything design.
          </p>
        </div>
      </section>

      {/* Right Side: Content Sections */}
      <section className="right-column">
        {/* Top Header Row */}
        <div className="top-grid">
          <div className="top-item">
            <h3>Got a question?</h3>
            <p>Get in touch</p>
          </div>
          <div className="top-item">
            <h3>Stay in the loop</h3>
            <p>Subscribe</p>
          </div>
          <div className="top-item">
            <h3>I'm on socials</h3>
            <p>Follow me on x.com</p>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="main-content-grid">
          {/* Column 1: Projects & Features */}
          <div className="content-section">
            <div>
              <h2 className="section-header">Projects</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">10x Designers</span>
                  <span className="list-value">'22</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Off-Grid <span className="badge-new">new</span></span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Community Guide</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Kloffie</span>
                  <span className="list-value">'22</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Apex</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Design Gifts</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">365 Design tips</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Fridays with Fons</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Rise</span>
                  <span className="list-value">'23</span>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h2 className="section-header">Features</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">Config</span>
                  <span className="list-value">'22</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Hatch Conference</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Wall Street Journal</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">New York Times</span>
                  <span className="list-value">'22</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Macworld</span>
                  <span className="list-value">'23</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: Stack & Clients */}
          <div className="content-section">
            <div>
              <h2 className="section-header">Stack</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">Framer</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Typefully</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Overrrides</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Circle</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Iconists</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Screen Studio</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Relume</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Cleanshot</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Helpscout</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Figma</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Figma</span>
                  <span className="list-value">Web design</span>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h2 className="section-header">Clients</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">Bluesky</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Diagram</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Figma</span>
                  <span className="list-value">Visual design</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Channels */}
          <div className="content-section">
            <div>
              <h2 className="section-header">Channels</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">Twitter</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">LinkedIn</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Medium</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Substack</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Threads</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Apple Music</span>
                  <span className="list-value">Visual design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="book-session-btn">Book a session</button>
      </section>
    </main>
  );
}

export default App;
