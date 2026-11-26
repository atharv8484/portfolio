import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { sceneMarkup } from './sceneMarkup.js';
import { initPortfolio } from './legacy.js';
import AboutSection from './components/AboutSection.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import ProjectPages from './components/ProjectPages.jsx';
import ContactSection from './components/ContactSection.jsx';
import FAQsSection from './components/FAQsSection.jsx';
import CredentialsSection from './components/CredentialsSection.jsx';
import './styles.css';

function PoolScene({ hostRef }) {
  return <div ref={hostRef} dangerouslySetInnerHTML={{ __html: sceneMarkup }} />;
}

function SectionPanel({ panelRef }) {
  return (
    <section className="panel" id="panel" ref={panelRef}>
      <div className="card">
        <header>
          <a className="x" id="close" href="#" role="button" aria-label="Show navigation">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 5l-7 7 7 7" />
            </svg>
          </a>
          <a className="resume-download" id="resume-download" href="/resume.pdf" download="Atharv-Resume.pdf" hidden>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" /></svg>
            <span>Download resume (PDF)</span>
          </a>
        </header>
        <div className="body" id="pbody">
          <AboutSection />
          <ProjectsSection />
          <ProjectPages />
          <CredentialsSection />
          <ContactSection />
          <FAQsSection />
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const sceneRef = useRef(null);
  const panelRef = useRef(null);
  useEffect(() => {
    const pool = sceneRef.current?.querySelector('#pool');
    if (pool && panelRef.current) pool.insertBefore(panelRef.current, pool.querySelector('.tint'));
    return initPortfolio();
  }, []);
  return <><PoolScene hostRef={sceneRef} /><SectionPanel panelRef={panelRef} /></>;
}

createRoot(document.getElementById('root')).render(<Portfolio />);
