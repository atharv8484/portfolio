import { projects } from '../data/projects.js';

function ProjectList({ title, items }) {
  return (
    <section className="project-list-section">
      <h2>{title}</h2>
      <ul className="project-list">
        {items.map((project) => (
          <li key={project.slug}>
            <a href={`#project/${project.slug}`}>
              <span className="project-list-title">{project.title}</span>
              <span className="project-list-summary">{project.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ProjectsSection() {
  return (
    <article data-sec="projects" hidden>
      <ProjectList title="Flagship projects" items={projects.filter(({ category }) => category === 'flagship')} />
      <ProjectList title="Archives" items={projects.filter(({ category }) => category === 'archive')} />
    </article>
  );
}
