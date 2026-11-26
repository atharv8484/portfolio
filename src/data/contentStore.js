import { useSyncExternalStore } from 'react';
import defaultContent from './portfolio-content.json';

const KEY = 'atharv-portfolio-content-v1';
let value;
const listeners = new Set();

function read() {
  if (value) return value;
  try { value = { ...defaultContent, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { value = defaultContent; }
  return value;
}

export function getContent() { return read(); }
export function saveContent(next) {
  value = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}
export function resetLocalContent() {
  localStorage.removeItem(KEY);
  value = undefined;
  listeners.forEach((listener) => listener());
}
export function subscribeContent(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function usePortfolioContent() {
  return useSyncExternalStore(subscribeContent, getContent, () => defaultContent);
}
