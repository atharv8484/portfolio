export function Intro() {
  return (
    <section className="sub">
      <h1>Hi, I am Atharv.</h1>
      <p className="lead">
        I love to build things: websites, backend systems, AI tools, and a bit of everything in between. If it is interesting and I can make it work, I want to try it.
      </p>
    </section>
  );
}

export function AboutMe() {
  return (
    <section className="sub">
      <p>
        I am on a gap year in Khargone, Madhya Pradesh, getting ready to join Scaler School of Technology next year. I am using this time to build and learn at my own pace before college.
      </p>
      <p>
        I run Skateflow, a skating academy that teaches waveboarding, and I take freelance web development and SEO work for local businesses. In my own time I am teaching myself the math behind AI and building Mirrors, a memory system for students.
      </p>
      <p>
        The long-term plan is a cross-disciplinary research lab in the spirit of Bell Labs, where curiosity leads and different fields share a room. I am curious about quantum mechanics, Arduino electronics, ethical hacking, and where AI meets music and robotics.
      </p>
    </section>
  );
}

export function Strengths() {
  return (
    <section className="sub">
      <h2>I consider my strengths to be</h2>
      <ul className="plist">
        <li>Building things end to end, from backend to screen</li>
        <li>Making AI systems that stay accurate and clean</li>
        <li>Helping local businesses get found on Google</li>
        <li>Teaching myself hard things and sticking with them</li>
        <li>Running a real project, Skateflow, on my own</li>
      </ul>
      <h2>Tools I use</h2>
      <ul className="chips">
        <li>Node.js</li><li>Express</li><li>MongoDB</li><li>React</li><li>Gemini API</li>
        <li>Qdrant</li><li>Technical SEO</li><li>Copywriting</li><li>GSAP and Three.js (learning)</li>
      </ul>
    </section>
  );
}

export default function AboutSection() {
  return (
    <article data-sec="about" hidden>
      <Intro />
      <AboutMe />
      <Strengths />
    </article>
  );
}
