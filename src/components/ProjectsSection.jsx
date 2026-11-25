export default function ProjectsSection() {
  return (
    <article data-sec="projects" hidden>
      <h1>Projects</h1>
      <div className="grid">
        <div className="proj">
          <h3>Mirrors</h3>
          <p>An AI memory and note retrieval system for students. A knowledge graph feeds the model only clean, approved threads, so answers stay free of noise. Started at a hackathon and still in active development.</p>
          <ul className="chips"><li>Node.js</li><li>MongoDB</li><li>Gemini</li><li>Qdrant</li></ul>
        </div>
        <div className="proj">
          <h3>Skateflow</h3>
          <p>The website and promotion for my skating academy, which teaches waveboarding.</p>
          <p><a href="https://skateflow.vercel.app" target="_blank" rel="noopener">Visit skateflow.vercel.app</a></p>
        </div>
        <div className="proj">
          <h3>Shree Architect site and SEO</h3>
          <p>Freelance work for a local architect: fixed search crawlability on a React site, added local schema markup, set up Google Business Profile and optimized images.</p>
          <ul className="chips"><li>React</li><li>Local SEO</li><li>Schema</li></ul>
        </div>
        <div className="proj">
          <h3>Choksiwala Jewellers</h3>
          <p>A portfolio website for a family jewellery business.</p>
        </div>
        <div className="proj">
          <h3>AI and ML math roadmap</h3>
          <p>A self-taught path through linear algebra, calculus, probability and optimization, aimed at fine-tuning 7B models locally with LoRA.</p>
          <ul className="chips"><li>In progress</li></ul>
        </div>
      </div>
    </article>
  );
}
