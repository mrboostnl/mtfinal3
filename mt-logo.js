(function () {
  if (customElements.get('mt-logo')) return;
  const SVG = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 79 79" style="display:block;flex:none;overflow:visible" aria-hidden="true"><circle data-lg="c" cx="39.5" cy="39.5" r="39.5" fill="#FB7029"></circle><g transform="translate(19.328 18.098)"><g data-lg="s"><path d="M183.984,199.425a18.32,18.32,0,0,0,18.3,18.3h3.746a18.319,18.319,0,0,0,18.3-18.3V172.441H183.984Zm4.294-22.691h31.756v22.691a14.021,14.021,0,0,1-14.005,14.006h-3.746a14.021,14.021,0,0,1-14-14.006Z" transform="translate(-183.984 -172.441)" fill="#fff"></path></g><g data-lg="t"><path d="M196.951,211.217H206.3v9.25H210.6v-9.25h9.352v-4.294h-23Z" transform="translate(-188.278 -183.858)" fill="#fff"></path></g><g data-lg="v"><path d="M219.956,189.772v-5.036l-11.513,7.054-11.513-7.053v5.036l11.513,7.054Z" transform="translate(-188.272 -176.512)" fill="#fff"></path></g></g></svg>`;
  function play(root) {
    if (root.__lgBusy || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const q = (k) => root.querySelector('[data-lg="' + k + '"]');
    if (!q('c')) return;
    root.__lgBusy = true;
    ['c', 's', 't', 'v'].forEach((k) => { const el = q(k); el.style.transformBox = 'fill-box'; el.style.transformOrigin = '50% 50%'; });
    q('c').animate([{ transform: 'scale(1)' }, { transform: 'scale(.86)', offset: .28 }, { transform: 'scale(1.08)', offset: .62 }, { transform: 'scale(1)' }], { duration: 900, easing: 'cubic-bezier(.45,0,.25,1)' });
    q('s').animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.3) rotate(-25deg)', opacity: 0, offset: .22 }, { transform: 'scale(1.12) rotate(6deg)', opacity: 1, offset: .62 }, { transform: 'none', opacity: 1 }], { duration: 900, easing: 'cubic-bezier(.45,0,.25,1)' });
    q('v').animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-8px)', opacity: 0, offset: .2 }, { transform: 'translateY(-12px)', opacity: 0, offset: .4 }, { transform: 'translateY(2px)', opacity: 1, offset: .72 }, { transform: 'none', opacity: 1 }], { duration: 950, easing: 'ease-out' });
    q('t').animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(8px) scaleY(.4)', opacity: 0, offset: .2 }, { transform: 'translateY(12px) scaleY(.4)', opacity: 0, offset: .46 }, { transform: 'translateY(-2px) scaleY(1.1)', opacity: 1, offset: .78 }, { transform: 'none', opacity: 1 }], { duration: 1000, easing: 'ease-out' }).onfinish = () => { root.__lgBusy = false; };
  }
  window.mtLogoPlay = play;
  class MtLogo extends HTMLElement {
    connectedCallback() {
      if (this._r) return; this._r = true;
      const size = this.getAttribute('size') || '36';
      this.style.display = 'inline-flex'; this.style.flex = 'none';
      this.innerHTML = SVG(size);
      const scope = this.getAttribute('scope') === 'self' ? this : (this.closest('a') || this);
      this._t = scope;
      this._h = () => play(this);
      scope.addEventListener('mouseenter', this._h);
    }
    disconnectedCallback() { if (this._t) this._t.removeEventListener('mouseenter', this._h); this._r = false; }
  }
  customElements.define('mt-logo', MtLogo);
})();
