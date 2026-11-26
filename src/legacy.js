import { getContent } from './data/contentStore.js';

export function initPortfolio() {

    const $ = id => document.getElementById(id);
    const scrim = $("scrim"), fsh = $("fshadow"), pool = $("pool"), bear = $("bear"), tilt = $("tilt"), head = $("head"), eyes = $("eyes"), rips = $("ripples");
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    let W = innerWidth, H = innerHeight, S = bear.offsetWidth;
    const pos = { x: W * .2, y: H * .6 }, vel = { x: 0, y: 0 }, target = { x: W * .2, y: H * .6 };
    let navOn = true, hasPointer = false, last = performance.now(), lastRip = 0, lastIdle = 0;
    let skeletonClicks = [];

    addEventListener("resize", () => { W = innerWidth; H = innerHeight; S = bear.offsetWidth });
    addEventListener("pointermove", e => { target.x = e.clientX; target.y = e.clientY; hasPointer = true });
    addEventListener("pointerdown", e => {
      if (e.target.closest && e.target.closest(".panel.open")) return;
      if (navOn) {
        const r = bear.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          const nowClick = performance.now();
          skeletonClicks = skeletonClicks.filter(time => nowClick - time < 2500);
          skeletonClicks.push(nowClick);
          if (skeletonClicks.length >= 5) { skeletonClicks = []; dispatchEvent(new Event('admin:open')); }
        }
      }
      target.x = e.clientX; target.y = e.clientY; hasPointer = true;
      ripple(e.clientX, e.clientY, S * .55); ripple(pos.x, pos.y + S * .15, S * .85); heart();
    });

    function ripple(x, y, size) {
      const r = document.createElement("div");
      r.className = "rip"; r.style.cssText = `left:${x}px;top:${y}px;--s:${size}px`;
      rips.appendChild(r); r.addEventListener("animationend", () => r.remove());
    }
    function heart() {
      const h = document.createElement("div");
      h.className = "heart"; h.textContent = "\u2665";
      h.style.cssText = `left:${pos.x - 8}px;top:${pos.y - S * .3}px`;
      pool.appendChild(h); h.addEventListener("animationend", () => h.remove());
    }
    setInterval(() => {
      eyes.classList.add("blink");
      setTimeout(() => eyes.classList.remove("blink"), 140);
    }, 3600);

    const links = [...document.querySelectorAll(".nav a")].map(el => ({ el, r: null, rs: [], zk: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, on: false, cool: 0 }));
    function measure() {
      const n = document.querySelector(".nav").getBoundingClientRect();
      links.forEach(l => { const e = l.el; l.r = { x: n.left + e.offsetLeft, y: n.top + e.offsetTop - 2, w: e.offsetWidth, h: e.offsetHeight + 4 }; l.rs = [l.r] });
    }
    measure(); addEventListener("resize", measure);
    if (document.fonts) document.fonts.ready.then(measure);

    let textT = [], pend = 0;
    const sq = { z: 0, vz: 0, r: 0, vr: 0, h: false };
    const BOX = ".chips li,.links a,.x";
    function lineRects(el) {
      if (el.matches(BOX)) { const b = el.getBoundingClientRect(); return [{ x: b.left, y: b.top, w: b.width, h: b.height }] }
      const rg = document.createRange(); rg.selectNodeContents(el);
      return [...rg.getClientRects()].filter(b => b.width > 2 && b.height > 2).map(b => ({ x: b.left, y: b.top, w: b.width, h: b.height }));
    }
    function measureText() {
      if (navOn) return;
      const br = $("pbody").getBoundingClientRect();
      textT.forEach(t => {
        const inBody = t.el.closest(".body");
        t.rs = lineRects(t.el).filter(r => !inBody || (r.y + r.h > br.top && r.y < br.bottom));
      });
    }
    function buildText() {
      textT.forEach(t => { t.el.style.transform = ""; t.on = false });
      textT = navOn ? [] : [...panel.querySelectorAll("[data-sec]:not([hidden]) :is(h1,h2,h3,p,summary,.chips li,.links a,.plist li),.x")].map(el => ({ el, rs: [], zk: .25, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, on: false, cool: 0 }));
      measureText(); setTimeout(measureText, 420);
    }
    const panel = $("panel"), navwrap = document.querySelector(".navwrap");
    let currentRoute = "";
    pool.insertBefore(panel, document.querySelector(".tint"));
    function route(forced) {
      const id = typeof forced === "string" ? forced : location.hash.slice(1), content = getContent(), projects = content.projects;
      const views = ["about", "projects", "contact", "faqs", "credentials", ...projects.map(p => `project/${p.slug}`), ...projects.filter(p => p.journey).map(p => `journey/${p.slug}`)];
      const on = views.includes(id);
      currentRoute = id;
      panel.classList.toggle("open", on); scrim.classList.toggle("on", on); bear.classList.toggle("deep", on); navwrap.classList.toggle("hide", on);
      document.querySelectorAll("[data-sec]").forEach(s => s.hidden = s.dataset.sec !== id);
      panel.classList.toggle("tall", id === "about" || id === "credentials");
      panel.classList.toggle("resume-view", id === "about");
      $("resume-download").hidden = id !== "about";
      navOn = !on; if (on) $("pbody").scrollTop = 0; setPH(); buildText();
      const projectSlug = id.split("/")[1], project = projects.find(item => item.slug === projectSlug);
      const title = id === "credentials" ? "Certificates & Achievements" : id.startsWith("project/") ? project?.title : id.startsWith("journey/") ? `${project?.title || "Project"} journey` : id[0]?.toUpperCase() + id.slice(1);
      document.title = on ? `${title} | Atharv` : "Atharv | Portfolio";
    }
    function setPH() { const b = $("pbody"); b.style.setProperty("--ph", Math.max(240, b.clientHeight - 50) + "px"); requestAnimationFrame(() => { b.style.setProperty("--ph", Math.max(240, b.clientHeight - 50) + "px"); measureText() }) }
    addEventListener("resize", setPH);
    const subIO = new IntersectionObserver(es => { es.forEach(e => e.target.classList.toggle("in", e.isIntersecting)); setTimeout(measureText, 750) }, { root: $("pbody"), threshold: .35 });
    document.querySelectorAll(".sub").forEach(el => subIO.observe(el));
    addEventListener("hashchange", () => route()); route(location.hash.slice(1) || "about");
    $("pbody").addEventListener("scroll", () => { if (!pend) { pend = 1; requestAnimationFrame(() => { pend = 0; measureText() }) } }, { passive: true });
    addEventListener("resize", measureText); panel.addEventListener("toggle", measureText, true);
    if (document.fonts) document.fonts.ready.then(measureText);
    function openSection(id) {
      try { location.hash = id } catch (_) { }
      if (location.hash.slice(1) !== id) route(id);
    }
    function goHome() {
      try { history.replaceState(null, "", location.pathname + location.search) } catch (_) { try { location.hash = "" } catch (__) { } }
      route("");
    }
    function goBack() {
      if (currentRoute.startsWith("project/") || currentRoute.startsWith("journey/")) {
        history.back();
      } else goHome();
    }
    $("close").addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); goBack() });
    addEventListener("keydown", e => { if (e.key === "Escape" && panel.classList.contains("open")) goHome() });

    const BREAK = 10; let broken = false;
    // hit the nav words hard enough and the skeleton (not the float) breaks into head, ribs and legs,
    // then the three pieces fly back and snap together again
    const SKP = [
      { ids: ["head"], ox: 35.7, oy: 29.7, dist: 1.0, lift: -.25, rot: 300 },
      { ids: ["sk-ribs", "sk-arms"], ox: 40.7, oy: 50, dist: .6, lift: .2, rot: 200 },
      { ids: ["sk-legs"], ox: 63, oy: 71.7, dist: 1.1, lift: .3, rot: 400 }
    ];
    function skShow(on) { ["head", "sk-ribs", "sk-arms", "sk-legs"].forEach(id => { $(id).style.visibility = on ? "" : "hidden" }) }
    function breakSkeleton(nx, ny, link) {
      broken = true;
      const half = S / 2, bx = pos.x - half, by = pos.y - half, base = Math.atan2(ny, nx), pieces = [];
      SKP.forEach(sp => {
        const el = document.createElement("div");
        el.className = "frag";
        el.style.cssText = `width:${S}px;height:${S}px;transform-origin:${sp.ox}% ${sp.oy}%`;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 300 300");
        sp.ids.forEach(id => {
          const c = $(id).cloneNode(true);
          c.removeAttribute("id"); c.querySelectorAll("[id]").forEach(n => n.removeAttribute("id"));
          svg.appendChild(c);
        });
        el.appendChild(svg); pool.appendChild(el);
        const ang = base + (Math.random() - .5) * 1.6, d = S * sp.dist * (.85 + Math.random() * .3);
        const ex = bx + Math.cos(ang) * d, ey = by + Math.sin(ang) * d + S * (.25 + sp.lift), rot = (Math.random() < .5 ? -1 : 1) * sp.rot * (.6 + Math.random() * .6);
        el.animate([{ transform: `translate(${bx}px,${by}px) rotate(0deg)` }, { transform: `translate(${ex}px,${ey}px) rotate(${rot}deg)` }], { duration: 850, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" });
        pieces.push({ el, ex, ey, rot });
      });
      skShow(false);
      ripple(pos.x, pos.y, S * .9); ripple(pos.x, pos.y, S * 1.3);
      setTimeout(() => {
        const tx = pos.x - half, ty = pos.y - half;
        pieces.forEach(f => f.el.animate([{ transform: `translate(${f.ex}px,${f.ey}px) rotate(${f.rot}deg)` }, { transform: `translate(${tx}px,${ty}px) rotate(0deg)` }], { duration: 600, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" }));
      }, 1100);
      setTimeout(() => {
        skShow(true);
        pieces.forEach(f => f.el.remove());
        ripple(pos.x, pos.y + S * .2, S * .8); heart();
        broken = false;
      }, 1720);
      // a few seconds later, open the section whose word it crashed into
      const target = link && link.el && link.el.hash ? link.el.hash.slice(1) : "";
      setTimeout(() => { if (target && navOn) openSection(target) }, 1200);
    }

    function tick(now) {
      const dt = Math.min(2.5, (now - last) / 16.67); last = now;
      let tx = target.x, ty = target.y;
      if (!hasPointer) { tx = W / 2 + Math.cos(now / 2300) * W * .2; ty = H / 2 + Math.sin(now / 2900) * H * .14; }
      const half = S / 2;
      const px = clamp(tx, half * .6, W - half * .6), py = clamp(ty, half * .6, H - half * .5);
      vel.x += (px - pos.x) * .0038 * dt; vel.y += (py - pos.y) * .0038 * dt;
      const damp = Math.pow(.93, dt); vel.x *= damp; vel.y *= damp;
      pos.x += vel.x * dt; pos.y += vel.y * dt;

      // bounce off text (nav words or page text): the skeleton squashes, the text jolts
      const R = S * .4, T = navOn && !broken ? links : [];
      for (const l of T) {
        for (const r of l.rs) {
          const cx = clamp(pos.x, r.x, r.x + r.w), cy = clamp(pos.y, r.y, r.y + r.h);
          let nx = pos.x - cx, ny = pos.y - cy, dist = Math.hypot(nx, ny);
          if (dist >= R) continue;
          if (dist < .001) {
            const dl = pos.x - r.x, dr = r.x + r.w - pos.x, dtp = pos.y - r.y, db = r.y + r.h - pos.y, m = Math.min(dl, dr, dtp, db);
            nx = m === dl ? -1 : m === dr ? 1 : 0; ny = m === dtp ? -1 : m === db ? 1 : 0; if (!nx && !ny) ny = -1; dist = -m;
          } else { nx /= dist; ny /= dist }
          pos.x += nx * (R - dist); pos.y += ny * (R - dist);
          const vn = vel.x * nx + vel.y * ny;
          if (vn < 0) {
            const hit = -vn, e = hit > 1.5 ? .85 : 0;
            vel.x -= (1 + e) * vn * nx; vel.y -= (1 + e) * vn * ny;
            if (hit > 1.5) {
              const p = Math.min(hit, 9);
              sq.vz += .012 * p; sq.vr -= nx * p * .5; sq.h = Math.abs(nx) > Math.abs(ny);
              if (hit >= BREAK && !broken) breakSkeleton(nx, ny, l);
              if (now - l.cool > 350) {
                l.cool = now; l.on = true;
                l.vx -= nx * p * .7; l.vy -= ny * p * .7; l.vz += .006 * p * l.zk;
                ripple(cx, cy, S * .45);
              }
            }
          }
        }
      }
      pos.x = clamp(pos.x, S * .2, W - S * .2); pos.y = clamp(pos.y, S * .2, H - S * .2);
      sq.vz -= .18 * sq.z * dt; sq.vr -= .15 * sq.r * dt;
      const sd = Math.pow(.84, dt); sq.vz *= sd; sq.vr *= sd; sq.z += sq.vz * dt; sq.r += sq.vr * dt;
      for (const l of links.concat(textT)) {
        if (!l.on) continue;
        l.vx -= .1 * l.x * dt; l.vy -= .1 * l.y * dt; l.vz -= .1 * l.z * dt;
        const f = Math.pow(.86, dt); l.vx *= f; l.vy *= f; l.vz *= f;
        l.x += l.vx * dt; l.y += l.vy * dt; l.z += l.vz * dt;
        if (Math.abs(l.x) + Math.abs(l.y) + Math.abs(l.vx) + Math.abs(l.vy) + (Math.abs(l.z) + Math.abs(l.vz)) * 100 < .05) {
          l.x = l.y = l.z = l.vx = l.vy = l.vz = 0; l.on = false; l.el.style.transform = "";
        } else l.el.style.transform = `translate(${l.x.toFixed(2)}px,${l.y.toFixed(2)}px) scale(${(1 + l.z).toFixed(3)})`;
      }

      bear.style.transform = `translate(${pos.x - half}px,${pos.y - half}px)`;
      fsh.style.transform = `translate(${pos.x - half + S * .08}px,${pos.y - half + S * .35}px) scale(1.04)`;
      { const bs = 1 + clamp(Math.abs(vel.y) * .004, 0, .04), q = sq.z; tilt.style.transform = `rotate(${(clamp(vel.x * 2.4, -14, 14) + sq.r).toFixed(2)}deg) scale(${(bs * (sq.h ? 1 - q : 1 + q * .6)).toFixed(3)},${(bs * (sq.h ? 1 + q * .6 : 1 - q)).toFixed(3)})` }

      const dx = tx - pos.x, dy = ty - pos.y, d = Math.min(1, Math.hypot(dx, dy) / 260), a = Math.atan2(dy, dx);
      const ex = Math.cos(a) * 3.4 * d, ey = Math.sin(a) * 2.8 * d;
      eyes.setAttribute("transform", `translate(${ex.toFixed(2)} ${ey.toFixed(2)})`);
      head.setAttribute("transform", `translate(${(ex * .9).toFixed(2)} ${(ey * .7).toFixed(2)}) rotate(${clamp(dx / 70, -9, 9).toFixed(2)} 107 112)`);

      const sp = Math.hypot(vel.x, vel.y);
      if (sp > .9 && now - lastRip > 280) { ripple(pos.x, pos.y + S * .2, S * .7); lastRip = now }
      else if (now - lastIdle > 1800) { ripple(pos.x, pos.y + S * .2, S * .6); lastIdle = now }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  
}
