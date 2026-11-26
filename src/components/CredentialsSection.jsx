import { useRef, useState } from 'react';

const certificates = [
  { title: 'Introduction to Generative AI', image: '/images/certificate-generative-ai.svg' },
  { title: 'Full Stack Web Development', image: '/images/certificate-web-development.svg' },
  { title: 'Technical SEO Foundations', image: '/images/certificate-seo.svg' },
];

const achievements = [
  { title: 'Hackathon project showcase', detail: 'Example milestone · replace with your achievement' },
  { title: 'Launched a personal project', detail: 'Example milestone · replace with your achievement' },
  { title: 'Community learning milestone', detail: 'Example milestone · replace with your achievement' },
];

function SlideDots({ count, active, onSelect, label }) {
  return (
    <div className="slide-dots" aria-label={`${label} slide ${active + 1} of ${count}`}>
      {Array.from({ length: count }, (_, index) => (
        <button
          type="button"
          key={index}
          className={`slide-dot${index === active ? ' active' : ''}`}
          onClick={() => onSelect(index)}
          aria-label={`Show ${label.toLowerCase()} ${index + 1} of ${count}`}
          aria-current={index === active ? 'true' : undefined}
        />
      ))}
    </div>
  );
}

function DraggableSlider({ title, items, type }) {
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const updateActive = () => {
    const track = trackRef.current;
    if (track?.clientWidth) setActive(Math.min(items.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
  };
  const selectSlide = (index) => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  };
  const startDrag = (event) => {
    if (event.button !== 0) return;
    dragRef.current = { x: event.clientX, left: trackRef.current.scrollLeft };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event) => {
    if (!dragRef.current) return;
    trackRef.current.scrollLeft = dragRef.current.left - (event.clientX - dragRef.current.x);
  };
  const stopDrag = () => { dragRef.current = null; setDragging(false); };

  return (
    <div className={`credential-slider credential-slider-${type}`}>
      <div
        className={`credential-track${dragging ? ' is-dragging' : ''}`}
        ref={trackRef}
        onScroll={updateActive}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        role="region"
        aria-label={`${title} carousel. Drag or swipe to browse.`}
      >
        {items.map((item) => (
          <div className="credential-slide" key={item.title}>
            {type === 'certificate' ? (
              <>
                <img className="certificate-image" src={item.image} alt={`Temporary example certificate: ${item.title}`} draggable="false" />
                {/* <p className="credential-slide-title">{item.title} <span>· temporary example</span></p> */}
              </>
            ) : (
              <article className="achievement-card">
                <span className="achievement-sparkle" aria-hidden="true">✦</span>
                <span className="credential-tag">Temporary example</span>
                <h2>{item.title}</h2>
                <p>{item.detail}</p>
              </article>
            )}
          </div>
        ))}
      </div>
      <SlideDots count={items.length} active={active} onSelect={selectSlide} label={title} />
      <p className="drag-hint"><span aria-hidden="true">↔</span> Drag or swipe to browse</p>
    </div>
  );
}

export default function CredentialsSection() {
  return (
    <article data-sec="credentials" hidden className="credentials-section">
      <section className="sub credential-stage">
        <h1>Certificates</h1>
        <DraggableSlider title="Certificates" items={certificates} type="certificate" />
        <div className="scroll-cue" aria-label="Scroll">
          <span>Scroll</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </section>
      <section className="sub credential-stage">
        <h1>Achievements</h1>
        <DraggableSlider title="Achievements" items={achievements} type="achievement" />
      </section>
    </article>
  );
}
