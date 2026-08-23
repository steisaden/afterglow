/* ════════════════════════════════════════════════════════════════
   AFTERGLOW · dom.js — scroll wiring
   Sections own their anchors exactly like the reference grammar:
   measure [data-cam] offsets → continuous chapter-units float →
   nav state, clock labels, reveals and hero exit all read it.
   ════════════════════════════════════════════════════════════════ */

const $  = s => document.querySelector(s);
const $$ = s => [].slice.call(document.querySelectorAll(s));

export class ScrollDirector {
  constructor() {
    this.secs    = $$('[data-cam]');
    this.anchors = [];
    this.maxScroll = 1;
    this.u       = 0;          /* continuous chapter units 0..N-1 */
    this.uTarget = 0;
    this.activeSec = 0;

    this.railLinks = $$('#rail a');

    addEventListener('scroll', () => this.read(), { passive:true });
    addEventListener('resize', () => this.measure());
    this.measure(); this.read();
    this.wireReveals();
  }

  measure() {
    const vh = innerHeight;
    this.maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    this.anchors = this.secs.map((el, i) => {
      if (i === 0) return 0;
      if (i === this.secs.length - 1)
        return Math.min(el.offsetTop - vh * .38, this.maxScroll);
      return clampN(el.offsetTop + el.offsetHeight * .5 - vh * .5, 0, this.maxScroll);
    });
    for (let i = 1; i < this.anchors.length; i++)
      this.anchors[i] = Math.max(this.anchors[i], this.anchors[i-1] + 1);
  }

  read() {
    const y = scrollY;
    let u;
    if (y <= this.anchors[0]) u = 0;
    else {
      u = this.anchors.length - 1;
      for (let i = 0; i < this.anchors.length - 1; i++) {
        if (y <= this.anchors[i+1]) {
          u = i + (y - this.anchors[i]) / (this.anchors[i+1] - this.anchors[i]);
          break;
        }
      }
    }
    this.uTarget = u;
    this.syncNav(Math.round(u));
  }

  syncNav(active) {
    if (active === this.activeSec && this._navInit) return;
    this._navInit = true;
    this.activeSec = active;
    this.railLinks.forEach(l =>
      l.classList.toggle('on', +l.dataset.chapter === active));
  }

  wireReveals() {
    const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = $$('.mask, .rv');
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        e.target.classList.add('in');
      });
    }, { rootMargin:'0px 0px -8% 0px', threshold:.05 });
    items.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
      io.observe(el);
      if (REDUCE) el.classList.add('in');
    });

    this.clockItems = $$('#clock li').map(li => ({ at:+li.dataset.at, el:li }));
  }

  /* per-frame DOM updates driven by smoothed progress */
  frame(u, dt) {
    this.u += (u - this.u) * Math.min(1, dt * 6);
    /* weather clock labels light up near their beat */
    for (const c of this.clockItems || []) {
      const lit = Math.abs(this.u - c.at) < .06;
      c.el.classList.toggle('lit', lit);
    }
    /* hero exit: content lifts away as the walk begins */
    const hero = $('#heroLock');
    if (hero) {
      const exit = clampN((this.u - .12) / .5, 0, 1);
      hero.style.transform = `translateY(${exit * -64}px)`;
      hero.style.opacity = String(1 - exit * 1.15);
      hero.style.visibility = exit >= 1 ? 'hidden' : 'visible';
    }
  }
}

function clampN(v, a, b) { return v < a ? a : (v > b ? b : v); }
