import { usePortfolioContent } from '../data/contentStore.js';

function ProjectLinks({ project }) {
  const links = [
    project.github && { label: 'GitHub', href: project.github, temporary: project.githubTemporary },
    project.website && { label: 'Site', href: project.website, temporary: project.websiteTemporary },
  ].filter(Boolean);
  if (!links.length && !project.journey) return null;
  return (
    <section className="project-links">
      <h2>Links</h2>
      <ul className="project-action-list">
        {links.map(({ label, href, temporary }) => (
          <li key={label}><a className="project-button" href={href} target="_blank" rel="noopener noreferrer" title={temporary ? 'Temporary placeholder link' : label}>{label}</a></li>
        ))}
        {project.journey && <li><a className="project-button" href={`#journey/${project.slug}`}>Journey</a></li>}
      </ul>
      {links.some(({ temporary }) => temporary) && <p className="temporary-link-note">Some links are temporary placeholders.</p>}
    </section>
  );
}

function ProjectDetail({ project }) {
  return (
    <article data-sec={`project/${project.slug}`} hidden className="project-detail">
      <h1>{project.title}</h1>
      <div className="project-gallery" aria-label={`${project.title} project images`}>
        {project.images?.length ? project.images.slice(0, 2).map((image) => (
          <figure key={image.src}>
            <img src={image.src} alt={image.alt} />
            <figcaption>{image.caption}</figcaption>
          </figure>
        )) : (
          <div className="project-image-placeholder" role="img" aria-label={`Project screenshots for ${project.title} have not been added`}>
            <span>{project.title}</span>
            <small>Project images will appear here</small>
          </div>
        )}
      </div>  
      <h2>What it is</h2>
      <p>{project.description}</p>
      <h2>The problem</h2>
      <p>{project.problem}</p>
      <h2>How it solves it</h2>
      <p>{project.solution}</p>
      {project.technologies.length > 0 && (
        <ul className="chips">{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul>
      )}
      <ProjectLinks project={project} />
    </article>
  );
}

function ProjectJourney({ project }) {
  if (!project.journey) return null;
  return (
    <article data-sec={`journey/${project.slug}`} hidden className="project-journey">
      <h1>Journey</h1>
      <p className="lead journey-copy">{project.journey}</p>
    </article>
  );
}

export default function ProjectPages() {
  const { projects } = usePortfolioContent();
  return <>{projects.map((project) => <ProjectDetail project={project} key={`detail-${project.slug}`} />)}{projects.map((project) => <ProjectJourney project={project} key={`journey-${project.slug}`} />)}</>;
}
