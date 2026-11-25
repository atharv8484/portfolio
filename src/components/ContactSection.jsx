import { contactLinks } from '../data/contactLinks.js';

const links = [
  { label: 'Instagram', href: contactLinks.instagram, type: 'instagram' },
  { label: 'Email', href: contactLinks.email, type: 'email' },
  { label: 'LinkedIn', href: contactLinks.linkedin, type: 'linkedin' },
];

function ContactIcon({ type }) {
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle className="icon-dot" cx="17.6" cy="6.8" r="1" />
      </svg>
    );
  }
  if (type === 'email') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v12h-17zM4 7l8 6 8-6" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5.5v.1M10 19v-6c0-2.5 5-3 5 0v6M10 10v9M3.5 3.5h17v17h-17z" /></svg>;
}

export default function ContactSection() {
  return (
    <article data-sec="contact" hidden className="contact-section">
      <h1>Say hello</h1>
      <p className="lead">Hiring, building something, or just want to talk? Send a good question or a bad joke, either works. I'll do my best with the question. The joke, I'll probably answer with a worse one. Sorry in advance.</p>
      <ul className="links contact-links">
        {links.map((link) => (
          <li key={link.type}>
            <a className={`contact-app-link contact-app-${link.type}`} href={link.href} aria-label={link.label} target={link.type === 'email' ? undefined : '_blank'} rel={link.type === 'email' ? undefined : 'noopener noreferrer'}>
              <span className="contact-icon"><ContactIcon type={link.type} /></span>
              <span className="contact-app-name">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
