import { usePortfolioContent } from '../data/contentStore.js';
export default function FAQsSection() {
  const { faqs } = usePortfolioContent();
  return <article data-sec="faqs" hidden><h1>FAQs</h1>{faqs.map(([question, answer], index) => <details key={`${question}-${index}`}><summary>{question}</summary><p>{answer}</p></details>)}</article>;
}
