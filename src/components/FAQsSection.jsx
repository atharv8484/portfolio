const faqs = [
  ['What do you do?', 'I build websites and backend systems, help local businesses show up on Google, and run a skating academy. I also build AI tools like Mirrors.'],
  ['Can I hire you for a project?', 'Yes. I take freelance web development and SEO work, mostly for local businesses. Reach out from the Contact page.'],
  ['What is Mirrors?', 'An AI-powered memory and note retrieval system for students. It began at a hackathon and I am still building it.'],
  ['What is Skateflow?', 'A skating academy I run that teaches waveboarding. You can find it at skateflow.vercel.app.'],
  ['Why a gap year?', 'I want to build and learn at my own pace before college. I plan to join Scaler School of Technology next year.'],
  ['What is the long-term plan?', 'A research lab where AI, electronics, music, robotics and quantum computing share one roof, inspired by Bell Labs and MIT Media Lab.'],
];

export default function FAQsSection() {
  return (
    <article data-sec="faqs" hidden>
      <h1>FAQs</h1>
      {faqs.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </article>
  );
}
