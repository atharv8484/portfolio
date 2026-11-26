import { useEffect, useId, useRef, useState } from 'react';
import { getContent, resetLocalContent, saveContent, usePortfolioContent } from '../data/contentStore.js';

const tabs = ['About', 'Projects', 'Certificates', 'Achievements', 'Contact', 'FAQs'];

function Field({ label, value, onChange, multiline = false, placeholder = '' }) {
  const id = useId();
  return <label className="admin-field" htmlFor={id}>{label}{multiline ? <textarea id={id} value={value || ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /> : <input id={id} value={value || ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function ItemCard({ title, children, onDelete }) {
  return <section className="admin-item"><header><h3>{title}</h3>{onDelete && <button type="button" className="admin-delete" onClick={onDelete}>Delete</button>}</header>{children}</section>;
}

function CollectionEditor({ title, items, labelFor, makeNew, onUpdate, onAdd, onDelete, children }) {
  const [active, setActive] = useState(0);
  const index = Math.min(active, items.length - 1);
  const add = () => { onAdd(makeNew()); setActive(items.length); };
  return <div className="admin-collection">
    <aside className="admin-record-list"><div className="admin-list-heading"><h3>{title}</h3><button type="button" onClick={add}>+ Add</button></div>
      {items.map((item, i) => <button type="button" key={i} className={i === index ? 'active' : ''} onClick={() => setActive(i)}><span>{labelFor(item, i)}</span><small>{i + 1}</small></button>)}
      {!items.length && <p>No {title.toLowerCase()} yet.</p>}
    </aside>
    {index >= 0 ? <section className="admin-record-form"><header><h3>Edit {title.slice(0, -1)}</h3><button type="button" className="admin-delete" onClick={() => { onDelete(index); setActive(Math.max(0, index - 1)); }}>Delete</button></header>{children(items[index], (patch) => onUpdate(index, patch))}</section> : <div className="admin-record-empty">Select an item or add a new one to start editing.</div>}
  </div>;
}

function AdminEditor() {
  const content = usePortfolioContent();
  const [tab, setTab] = useState('About');
  const fileRef = useRef(null);
  const update = (key, value) => saveContent({ ...getContent(), [key]: value });
  const updateList = (key, index, patch) => update(key, content[key].map((item, i) => i === index ? (Array.isArray(item) ? item.map((v, j) => patch[j] ?? v) : { ...item, ...patch }) : item));
  const deleteItem = (key, index) => update(key, content[key].filter((_, i) => i !== index));
  const patchItem = (key, index, patch) => updateList(key, index, patch);
  const exportFile = () => {
    const blob = new Blob([JSON.stringify(getContent(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'portfolio-content.json'; link.click(); URL.revokeObjectURL(url);
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      for (const key of ['about', 'projects', 'faqs', 'certificates', 'achievements', 'socials']) if (!(key in parsed)) throw new Error('Missing content sections');
      saveContent(parsed); setTab('About'); alert('Portfolio content imported.');
    } catch { alert('That file is not a valid portfolio content JSON file.'); }
    event.target.value = '';
  };

  return <div className="admin-editor-layout">
    <aside className="admin-sidebar">
      <div className="admin-sidebar-title"><span>CONTENT</span><strong>Workspace</strong></div>
      <nav className="admin-tabs" aria-label="Editable sections">{tabs.map((item) => <button type="button" className={tab === item ? 'selected' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</nav>
      <div className="admin-data-actions"><button type="button" onClick={exportFile}>Export JSON</button><button type="button" onClick={() => fileRef.current?.click()}>Import JSON</button><button type="button" onClick={() => { if (window.confirm('Clear this browser’s edits and load the project JSON?')) { resetLocalContent(); window.location.reload(); } }}>Use project JSON</button><input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importFile} /><span>Browser edits override project JSON</span></div>
    </aside>
    <main className="admin-main">
      <header className="admin-main-heading"><div><small>SECTION EDITOR</small><h2>{tab}</h2></div><span className="admin-save-status"><i /> Saved automatically</span></header>
      <div className="admin-content">
      {tab === 'About' && content.about.map((item, index) => <ItemCard key={index} title={['Intro', 'About me', 'My strengths'][index] || `About subsection ${index + 1}`}><Field label="Heading" value={item.title} onChange={(title) => patchItem('about', index, { title })} /><Field label="Text" multiline value={item.body} onChange={(body) => patchItem('about', index, { body })} />{index === 2 && <Field label="Tools (comma-separated)" value={item.tools} onChange={(tools) => patchItem('about', index, { tools })} />}</ItemCard>)}
      {tab === 'Projects' && <CollectionEditor title="Projects" items={content.projects} labelFor={(p) => p.title || 'Untitled project'} makeNew={() => ({ slug: `project-${Date.now()}`, title: 'New project', category: 'archive', summary: '', description: '', problem: '', solution: '', technologies: [], images: [], website: '', github: '', journey: '' })} onAdd={(item) => update('projects', [...content.projects, item])} onDelete={(i) => deleteItem('projects', i)} onUpdate={(i, patch) => patchItem('projects', i, patch)}>{(p, set) => <div className="admin-fields-grid"><Field label="Title" value={p.title} onChange={(title) => set({ title })} /><Field label="URL slug" value={p.slug} onChange={(slug) => set({ slug })} /><label className="admin-field">Category<select value={p.category || 'archive'} onChange={(e) => set({ category: e.target.value })}><option value="flagship">Flagship</option><option value="archive">Archive</option></select></label><Field label="Short description" value={p.summary} onChange={(summary) => set({ summary })} /><Field label="Description" multiline value={p.description} onChange={(description) => set({ description })} /><Field label="Problem" multiline value={p.problem} onChange={(problem) => set({ problem })} /><Field label="Solution" multiline value={p.solution} onChange={(solution) => set({ solution })} /><Field label="Technologies, comma-separated" value={(p.technologies || []).join(', ')} onChange={(text) => set({ technologies: text.split(',').map((v) => v.trim()).filter(Boolean) })} /><Field label="Website URL" value={p.website} onChange={(website) => set({ website })} /><Field label="GitHub URL" value={p.github} onChange={(github) => set({ github })} /><Field label="Journey (optional)" multiline value={p.journey} onChange={(journey) => set({ journey })} /><Field label="Image URL" value={p.images?.[0]?.src} onChange={(src) => set({ images: src ? [{ ...(p.images?.[0] || {}), src, alt: p.images?.[0]?.alt || p.title, caption: p.images?.[0]?.caption || '' }] : [] })} /><Field label="Image caption" value={p.images?.[0]?.caption} onChange={(caption) => set({ images: p.images?.length ? [{ ...p.images[0], caption }] : [] })} /></div>}</CollectionEditor>}
      {tab === 'Certificates' && <CollectionEditor title="Certificates" items={content.certificates} labelFor={(x) => x.title || 'Untitled certificate'} makeNew={() => ({ title: 'New certificate', image: '' })} onAdd={(x) => update('certificates', [...content.certificates, x])} onDelete={(i) => deleteItem('certificates', i)} onUpdate={(i, patch) => patchItem('certificates', i, patch)}>{(x, set) => <><Field label="Certificate name" value={x.title} onChange={(title) => set({ title })} /><Field label="Image URL" value={x.image} onChange={(image) => set({ image })} /></>}</CollectionEditor>}
      {tab === 'Achievements' && <CollectionEditor title="Achievements" items={content.achievements} labelFor={(x) => x.title || 'Untitled achievement'} makeNew={() => ({ title: 'New achievement', detail: '' })} onAdd={(x) => update('achievements', [...content.achievements, x])} onDelete={(i) => deleteItem('achievements', i)} onUpdate={(i, patch) => patchItem('achievements', i, patch)}>{(x, set) => <><Field label="Achievement" value={x.title} onChange={(title) => set({ title })} /><Field label="Details" multiline value={x.detail} onChange={(detail) => set({ detail })} /></>}</CollectionEditor>}
      {tab === 'Contact' && <div className="admin-socials"><h3>Social links</h3>{Object.entries(content.socials).map(([key, value]) => <Field key={key} label={key} value={value} onChange={(next) => update('socials', { ...getContent().socials, [key]: next })} />)}</div>}
      {tab === 'FAQs' && <CollectionEditor title="FAQs" items={content.faqs} labelFor={(x) => x[0] || 'Untitled question'} makeNew={() => ['New question', 'New answer']} onAdd={(x) => update('faqs', [...content.faqs, x])} onDelete={(i) => deleteItem('faqs', i)} onUpdate={(i, patch) => patchItem('faqs', i, patch)}>{([question, answer], set) => <><Field label="Question" value={question} onChange={(v) => set([v, answer])} /><Field label="Answer" multiline value={answer} onChange={(v) => set([question, v])} /></>}</CollectionEditor>}
      </div>
    </main>
  </div>;
}

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => { const show = () => { setOpen(true); setUnlocked(false); setPassword(''); setMessage(''); }; window.addEventListener('admin:open', show); return () => window.removeEventListener('admin:open', show); }, []);
  if (!open) return null;
  const close = () => { setOpen(false); setUnlocked(false); };
  const verifyPassword = async (event) => {
    event.preventDefault(); setMessage('Checking…');
    try {
      const response = await fetch('/api/admin/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (response.ok) { setUnlocked(true); setMessage(''); }
      else setMessage('Incorrect password.');
    } catch { setMessage('Password check needs the local development server.'); }
  };
  return <div className="admin-backdrop" role="presentation"><section className="admin-window" role="dialog" aria-modal="true" aria-label="Portfolio admin"><header className="admin-header"><div><small>PORTFOLIO MANAGEMENT</small><h2>Admin workspace</h2></div><button type="button" onClick={close} aria-label="Close admin">×</button></header>{!unlocked ? <form className="admin-login" onSubmit={verifyPassword}><div className="admin-login-icon">⌑</div><h3>Welcome back</h3><p>Enter your admin password to manage portfolio content.</p><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoFocus value={password} onChange={(event) => setPassword(event.target.value)} /><button type="submit">Unlock admin</button><span>{message}</span></form> : <AdminEditor />}</section></div>;
}
