// BIOLAND-Cy — small progressive enhancements. Everything works without this file.
const root = document.documentElement;
const reduce = () => root.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Mobile menu */
const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const nav = document.querySelector<HTMLElement>('[data-nav]');
if (btn && nav) {
  const set = (open: boolean) => { btn.setAttribute('aria-expanded', String(open)); nav.dataset.open = String(open); };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); } });
  nav.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) set(false); });
  matchMedia('(min-width: 1200px)').addEventListener('change', () => set(false));
}

/* Header hides on scroll down and comes back on scroll up (never while the menu is open or focus is inside) */
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  let last = scrollY, ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY, open = btn?.getAttribute('aria-expanded') === 'true', focusIn = header.contains(document.activeElement);
      header.dataset.hidden = String(y > last && y > 240 && !open && !focusIn);
      last = y; ticking = false;
    });
  }, { passive: true });
  header.addEventListener('focusin', () => { header.dataset.hidden = 'false'; });
}

/* Layer stack: the step in view lifts its layer out of the 3D stack */
document.querySelectorAll<HTMLElement>('[data-stack]').forEach((sec) => {
  const stack = sec.querySelector<HTMLElement>('[data-stack-3d]');
  const layers = sec.querySelectorAll<HTMLElement>('[data-layer]');
  const dots = sec.querySelectorAll<HTMLElement>('[data-dot]');
  const legend = sec.querySelector<HTMLElement>('[data-stack-legend]');
  const steps = sec.querySelectorAll<HTMLElement>('[data-step]');
  const labels = Array.from(steps).map((s) => s.querySelector('.k span:last-child')?.textContent ?? '');
  const n = layers.length, gap = 30, lift = 120;
  const show = (i: number) => {
    stack?.setAttribute('data-spread', 'true');
    layers.forEach((l, j) => {
      const z = (n - 1 - j) * gap + (j === i ? lift : 0);
      l.style.transform = `translateZ(${z}px)`;
      l.dataset.on = String(j === i);
      l.dataset.past = String(j < i);
    });
    dots.forEach((d, j) => (d.dataset.on = String(j <= i)));
    if (legend) legend.textContent = `${String(i + 1).padStart(2, '0')} · ${labels[i]}`;
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) show(Number((e.target as HTMLElement).dataset.step)); }),
    { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => io.observe(s));
});

/* Compare slider */
document.querySelectorAll<HTMLElement>('[data-compare]').forEach((c) => {
  const r = c.querySelector<HTMLInputElement>('input[type=range]');
  r?.addEventListener('input', () => c.style.setProperty('--pos', r.value + '%'));
});

/* Altimeter: the page as a descent from orbit to the ground */
const alt = document.querySelector<HTMLElement>('[data-altimeter]');
if (alt) {
  const read = alt.querySelector<HTMLElement>('[data-alt-read]');
  const secs = Array.from(document.querySelectorAll<HTMLElement>('[data-alt]'));
  let tick = false;
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    alt.style.setProperty('--p', String(Math.min(1, Math.max(0, scrollY / Math.max(1, max)))));
    const mid = innerHeight / 2;
    const cur = secs.find((s) => { const b = s.getBoundingClientRect(); return b.top <= mid && b.bottom >= mid; });
    if (cur && read) { read.textContent = cur.dataset.alt ?? ''; alt.dataset.dark = String(cur.classList.contains('on-dark') || cur.classList.contains('navy-field')); }
    tick = false;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  requestAnimationFrame(() => setTimeout(upd, 0));
}

/* Galleries: previous / next buttons (an alternative to swiping, WCAG 2.5.7) */
document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((g) => {
  const track = g.querySelector<HTMLElement>('[data-track]');
  g.querySelectorAll<HTMLButtonElement>('[data-dir]').forEach((b) =>
    b.addEventListener('click', () => {
      if (!track) return;
      const card = track.firstElementChild as HTMLElement | null;
      const step = (card?.offsetWidth ?? 300) + 18;
      track.scrollBy({ left: Number(b.dataset.dir) * step, behavior: reduce() ? 'auto' : 'smooth' });
    }),
  );
});

/* Film: plays once when in view (muted, never for reduced motion), with a visible pause button */
document.querySelectorAll<HTMLElement>('[data-film]').forEach((f) => {
  const v = f.querySelector('video'); const c = f.querySelector<HTMLButtonElement>('[data-film-ctrl]');
  if (!v || !c) return;
  const label = () => { c.textContent = v.paused ? (v.ended ? '↺ Replay the flight' : '▶ Play the flight') : '❚❚ Pause'; };
  c.addEventListener('click', () => { v.paused ? v.play() : v.pause(); });
  v.addEventListener('play', label); v.addEventListener('pause', label); v.addEventListener('ended', label); label();
  const tel: [number, number][] = JSON.parse(f.dataset.telemetry || '[]');
  const a = f.querySelector('[data-t-alt]'), h = f.querySelector('[data-t-hdg]'), t = f.querySelector('[data-t-t]');
  const fmt = new Intl.NumberFormat('en-GB');
  v.addEventListener('timeupdate', () => {
    const i = Math.min(tel.length - 1, Math.floor(v.currentTime * 24));
    if (tel[i] && a && h && t) { a.textContent = fmt.format(tel[i][0]); h.textContent = String(Math.round(tel[i][1])); t.textContent = v.currentTime.toFixed(1); }
  });
  if (reduce()) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting && v.paused && !v.dataset.played) { v.dataset.played = '1'; v.play().catch(() => {}); }
  }), { threshold: 0.5 });
  io.observe(f);
});

/* Motion toggle in the footer */
const mt = document.querySelector<HTMLButtonElement>('[data-motion-toggle]');
if (mt) {
  const sync = () => { const off = root.dataset.motion === 'off'; mt.setAttribute('aria-pressed', String(off)); mt.textContent = off ? 'Allow motion' : 'Reduce motion'; };
  mt.addEventListener('click', () => {
    const off = root.dataset.motion !== 'off';
    if (off) root.dataset.motion = 'off'; else delete root.dataset.motion;
    try { localStorage.setItem('bl-motion', off ? 'off' : 'on'); } catch (e) {}
    document.querySelectorAll('video').forEach((v) => off && v.pause());
    sync();
  });
  sync();
}

/* Newsletter (MailerLite, single opt-in: the MailerLite account cannot use double opt-in until it is approved) */
document.querySelectorAll<HTMLFormElement>('[data-newsletter]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector<HTMLInputElement>('input[type=email]');
    const msg = form.querySelector<HTMLElement>('[data-msg]');
    const b = form.querySelector<HTMLButtonElement>('button[type=submit]');
    const hp = form.querySelector<HTMLInputElement>('input[name=website]');
    if (!email || !email.checkValidity()) { email?.reportValidity(); return; }
    if (hp && hp.value) return;
    if (b) { b.disabled = true; b.textContent = 'Sending…'; }
    const fd = new FormData();
    fd.append('fields[email]', email.value.trim()); fd.append('ml-submit', '1'); fd.append('anticsrf', 'true');
    try { await fetch(form.action, { method: 'POST', body: fd, mode: 'no-cors' }); } catch (err) { /* opaque response */ }
    if (msg) { msg.hidden = false; msg.textContent = 'Thank you, you are subscribed. You can unsubscribe at any time with the link in every e-mail.'; }
    form.reset();
    if (b) { b.disabled = false; b.textContent = 'Subscribe'; }
  });
});

/* Project clock: keep "month X of 24" right between rebuilds */
{
  const n = new Date(); const m = Math.max(1, Math.min(24, (n.getFullYear() - 2026) * 12 + (n.getMonth() - 6) + 1));
  document.querySelectorAll<HTMLElement>('[data-pm]').forEach((e) => (e.textContent = `Project month ${m} / 24`));
  document.querySelectorAll<HTMLElement>('[data-pm-n]').forEach((e) => (e.textContent = String(m)));
  document.querySelectorAll<HTMLElement>('[data-timeline] [data-m]').forEach((e) => {
    const k = Number(e.dataset.m); e.dataset.done = String(k < m); e.dataset.now = String(k === m);
  });
}

/* Old single-page links (#about, #research …) go to the new pages */
{
  const map: Record<string, string> = { '#about': '/about', '#research': '/research', '#workpackages': '/research#work-packages', '#news': '/news', '#events': '/news', '#contact': '/contact' };
  if (location.pathname === '/' && map[location.hash]) location.replace(map[location.hash]);
}
