import { usePortfolioContent } from '../data/contentStore.js';

function ScrollCue({ text, label }) {
  return <div className="scroll-cue" aria-label={label}><span>{text}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></div>;
}

export default function AboutSection() {
  const { about } = usePortfolioContent();
  const [intro, biography, strengths] = about;
  return (
    <article data-sec="about" hidden>
      <section className="sub about-intro"><h1>{intro.title}</h1><p className="lead">{intro.body}</p><ScrollCue text="Scroll to explore" label="Scroll down to explore more about me" /></section>
      <section className="sub about-more">{biography.body.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}<ScrollCue text="Scroll to explore more" label="Scroll to explore more" /></section>
      <section className="sub">
        <h2>{strengths.title}</h2>
        <ul className="plist">{strengths.body.split('\n').filter(Boolean).map((item) => <li key={item}>{item}</li>)}</ul>
        <h2>Tools I use</h2>
        <ul className="chips">{strengths.tools.split(',').map((item) => <li key={item}>{item.trim()}</li>)}</ul>
      </section>
    </article>
  );
}
