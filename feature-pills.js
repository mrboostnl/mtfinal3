// Osmo Expanding Feature Pills — JS as supplied; CSS injected here (brand colours), GSAP loaded on demand.
(function () {
  var css = `
.feature-pills__wrap{color:#f2f2f2;background-color:#0E1120;border:none;border-radius:12px;width:100%;max-width:82.5em;height:45em;position:relative;overflow:clip;margin:0 auto}
.feature-pills__layout{justify-content:flex-start;align-items:stretch;width:100%;height:100%;display:flex;position:relative}
.feature-pills__col{width:50%;position:relative}
.feature-pills__visual-collection{z-index:0;width:100%;height:100%;position:relative}
.feature-pills__visual-item{opacity:0;width:100%;height:100%;position:absolute;inset:0%}
.feature-pills__visual-list{width:100%;height:100%;position:relative;overflow:hidden}
.feature-pills__visual-img{object-fit:cover;width:100%;height:100%;display:block}
.feature-pills__info-collection{flex-flow:column;justify-content:center;align-items:flex-start;width:100%;height:100%;padding-left:1.25em;padding-right:1.25em;display:flex}
.feature-pills__info-list{gap:1em;max-width:var(--content-item-expanded);flex-flow:column;flex:none;justify-content:center;align-items:flex-start;width:100%;margin:0 auto;padding:0;list-style:none;display:flex}
.feature-pills__info-item{padding:0;position:relative}
.feature-pills__item-bg{z-index:0;background-color:#ffffff14;border-radius:2em;width:100%;height:100%;position:absolute;inset:0%}
.feature-pills__item-button{z-index:1;gap:.625em;background-color:#0000;color:inherit;flex-flow:row;justify-content:flex-start;align-items:center;padding:.75em 1.25em;display:flex;position:relative;cursor:pointer;border:none;font:inherit}
.feature-pills__item-label{letter-spacing:-.015em;white-space:nowrap;flex:none;font-size:1.25em;font-weight:500}
.feature-pills__item-icon{aspect-ratio:1;background-color:#FB7029;border-radius:100em;flex:none;justify-content:center;align-items:center;width:1.25em;padding:0;display:flex;position:relative}
.feature-pills__item-icon-bar{background-color:#fff;flex:none;width:1.5px;height:50%;padding:0;position:absolute}
.feature-pills__item-icon-bar.is--horizontal{width:50%;height:1.5px}
.feature-pills__visual-cover{z-index:1;width:100%;height:100%;position:absolute;inset:0%}
.feature-pills__visual-cover-img{object-fit:cover;width:100%;height:100%;display:block}
.feature-pills__item-content{z-index:2;pointer-events:none;position:absolute;inset:0%}
.feature-pills__item-mask{width:100%;height:100%;overflow:hidden}
.feature-pills__item-inner{max-width:var(--content-item-expanded);flex-flow:column;justify-content:flex-start;align-items:flex-start;width:max-content;padding:1.5em 1.5em 2em;display:flex}
.feature-pills__item-body{margin:0;font-size:1.25em;font-weight:500;line-height:1.35}
.feature-pills__item-body-span{opacity:.6}
.feature-pills__close{z-index:2;position:absolute;top:1em;right:1em}
.feature-pills__close-button{aspect-ratio:1;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);background-color:#0E112066;border-radius:10em;justify-content:center;align-items:center;width:2.25em;padding:8px;display:flex;position:relative;cursor:pointer;border:none;font:inherit}
@media screen and (max-width:991px){.feature-pills__wrap{background-color:#0000;color:#11131F;border-style:none;border-radius:0;height:auto}.feature-pills__layout{flex-flow:column}.feature-pills__col{width:100%}.feature-pills__col.is--visual{aspect-ratio:1;border-radius:1.25em;order:-9999;overflow:hidden}.feature-pills__info-collection{padding:2.5em 0 1em}.feature-pills__info-list{flex-flow:wrap;justify-content:flex-start;align-items:flex-start;max-width:none}.feature-pills__info-item{width:var(--content-item-expanded)}.feature-pills__item-bg{background-color:#F1EEE8}.feature-pills__item-button{justify-content:space-between;align-items:center;width:100%}.feature-pills__item-inner{max-width:100%}}
[data-feature-pills-init]{--content-item-expanded:25em}
@media screen and (max-width:991px){[data-feature-pills-init]{--content-item-expanded:calc(50% - 0.5em)}}
@media screen and (max-width:767px){[data-feature-pills-init]{--content-item-expanded:100%}}
[data-feature-pills-button]{opacity:1;transition:opacity 400ms ease-in-out 300ms}
[data-feature-pills-inner]{opacity:0;transition:opacity 300ms ease-in-out 0ms}
[data-feature-pills-visual]{opacity:0;transition:opacity 350ms ease-in-out}
[data-feature-pills-cover]{opacity:1;transition:opacity 350ms ease-in-out}
[data-feature-pills-item][data-active="true"] [data-feature-pills-button]{opacity:0;transition:opacity 50ms ease-in-out 0ms}
[data-feature-pills-item][data-active="true"] [data-feature-pills-inner]{opacity:1}
[data-feature-pills-visual][data-active="true"]{opacity:1}
[data-feature-pills-cover][data-active="false"]{opacity:0}
[data-feature-pills-close]{transform:scale(0) rotate(135deg);opacity:0;pointer-events:none;transition:all 500ms cubic-bezier(.7,0,.3,1)}
[data-feature-pills-active="true"] [data-feature-pills-close]{transform:scale(1) rotate(45deg);opacity:1;pointer-events:auto}`;
  function addCss() { if (document.getElementById('feature-pills-css')) return; var s = document.createElement('style'); s.id = 'feature-pills-css'; s.textContent = css; document.head.appendChild(s); }
  function loadGsap(cb) { if (window.gsap) return cb(); var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js'; s.onload = cb; document.head.appendChild(s); }

  function initExpandingFeaturePills() {
    const wraps = document.querySelectorAll("[data-feature-pills-init]");
    if (!wraps.length) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    wraps.forEach((wrap, wrapIdx) => {
      if (wrap.__fpInit) return; wrap.__fpInit = true;
      const items = Array.from(wrap.querySelectorAll("[data-feature-pills-item]"));
      const visuals = Array.from(wrap.querySelectorAll("[data-feature-pills-visual]"));
      const cover = wrap.querySelector("[data-feature-pills-cover]");
      const closeBtn = wrap.querySelector("[data-feature-pills-close]");
      if (!items.length) return;
      const uidBase = `feature-pills-${wrapIdx}`;
      const ease = "back.out(2)";
      const animationDuration = 0.5;
      const getExpandedWidth = () => getComputedStyle(wrap).getPropertyValue("--content-item-expanded").trim() || "";
      const getActiveIndex = () => { const a = items.find((it) => it.getAttribute("data-active") === "true"); return a ? Number(a.getAttribute("data-feature-pills-index")) : null; };
      const setWrapActive = (on) => { wrap.setAttribute("data-feature-pills-active", on ? "true" : "false"); if (closeBtn) closeBtn.setAttribute("aria-hidden", on ? "false" : "true"); if (cover) { cover.setAttribute("data-active", on ? "false" : "true"); cover.setAttribute("aria-hidden", on ? "true" : "false"); } };
      const setVisualActive = (iOrNull) => { visuals.forEach((v) => { const idx = Number(v.getAttribute("data-feature-pills-index")); const a = iOrNull !== null && idx === iOrNull; v.setAttribute("data-active", a ? "true" : "false"); v.setAttribute("aria-hidden", a ? "false" : "true"); }); };
      const setItemA11y = (item, open) => { const btn = item.querySelector("[data-feature-pills-button]"); const c = item.querySelector("[data-feature-pills-content]"); if (!btn || !c) return; btn.setAttribute("aria-expanded", open ? "true" : "false"); c.setAttribute("aria-hidden", open ? "false" : "true"); };
      const measureButtonH = (item) => { const btn = item.querySelector("[data-feature-pills-button]"); return btn ? Math.ceil(btn.getBoundingClientRect().height) : 0; };
      const measureInnerH = (item, w) => { const inner = item.querySelector("[data-feature-pills-inner]"); if (!inner) return 0; const mask = item.querySelector(".feature-pills__item-mask"); const pm = mask ? mask.style.overflow : null; if (mask) mask.style.overflow = "visible"; const pw = inner.style.maxWidth; if (w) inner.style.maxWidth = w; const h = Math.ceil(inner.getBoundingClientRect().height); if (w) inner.style.maxWidth = pw || ""; if (mask) mask.style.overflow = pm || ""; return h; };
      const getHeights = (item, w) => { const buttonH = measureButtonH(item); const innerH = measureInnerH(item, w); return { buttonH, openH: Math.max(buttonH, innerH) }; };
      const collapsedWidthPx = new Map();
      const captureCollapsedWidths = () => { items.forEach((item) => { const p = item.style.width; item.style.width = ""; collapsedWidthPx.set(item, Math.ceil(item.getBoundingClientRect().width)); item.style.width = p; }); };
      const animateBox = (el, vars) => { gsap.killTweensOf(el); if (prefersReducedMotion) { if (vars.height != null) el.style.height = `${vars.height}px`; if (vars.width != null) el.style.width = typeof vars.width === "number" ? `${vars.width}px` : vars.width; return; } gsap.to(el, { ...vars, duration: animationDuration, ease, overwrite: true }); };
      const openItem = (item) => { const w = getExpandedWidth(); const { openH } = getHeights(item, w); item.setAttribute("data-active", "true"); setItemA11y(item, true); setWrapActive(true); const tw = w || `${collapsedWidthPx.get(item) || Math.ceil(item.getBoundingClientRect().width)}px`; animateBox(item, { height: openH, width: tw }); };
      const closeItem = (item) => { const w = getExpandedWidth(); const { buttonH } = getHeights(item, w); item.setAttribute("data-active", "false"); setItemA11y(item, false); const tw = collapsedWidthPx.get(item) || Math.ceil(item.getBoundingClientRect().width); animateBox(item, { height: buttonH, width: tw }); };
      const switchTo = (n) => { const cur = getActiveIndex(); if (cur === n) return; const next = items[n]; if (!next) return; if (cur !== null) closeItem(items[cur]); openItem(next); setVisualActive(n); };
      const closeAll = () => { const cur = getActiveIndex(); if (cur === null) return; closeItem(items[cur]); setVisualActive(null); setWrapActive(false); };
      items.forEach((item, i) => { item.setAttribute("data-feature-pills-index", String(i)); if (!item.hasAttribute("data-active")) item.setAttribute("data-active", "false"); const btn = item.querySelector("[data-feature-pills-button]"); const c = item.querySelector("[data-feature-pills-content]"); if (btn) { btn.setAttribute("data-feature-pills-index", String(i)); btn.type = "button"; if (!btn.id) btn.id = `${uidBase}-trigger-${i}`; } if (c && btn) { c.setAttribute("data-feature-pills-index", String(i)); if (!c.id) c.id = `${uidBase}-panel-${i}`; btn.setAttribute("aria-controls", c.id); c.setAttribute("role", "region"); c.setAttribute("aria-labelledby", btn.id); } });
      visuals.forEach((v, i) => v.setAttribute("data-feature-pills-index", String(i)));
      if (closeBtn) { closeBtn.type = "button"; closeBtn.addEventListener("click", closeAll); }
      items.forEach((item) => { item.style.height = `${measureButtonH(item)}px`; });
      setWrapActive(false); setVisualActive(null);
      items.forEach((item, i) => { const btn = item.querySelector("[data-feature-pills-button]"); if (btn) btn.addEventListener("click", () => switchTo(i)); });
      wrap.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
      setTimeout(() => { captureCollapsedWidths(); switchTo(0); }, 60);
      const debounce = (fn, wait = 150) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; };
      const handleResize = () => { const cur = getActiveIndex(); items.forEach((item) => { if (item.getAttribute("data-active") !== "true") item.style.width = ""; }); captureCollapsedWidths(); if (cur !== null) { const item = items[cur]; const w = getExpandedWidth(); const { openH } = getHeights(item, w); gsap.set(item, { height: openH, width: w || `${Math.ceil(item.getBoundingClientRect().width)}px` }); if (w) item.style.width = w; } else { items.forEach((item) => { item.style.height = `${measureButtonH(item)}px`; }); } };
      captureCollapsedWidths();
      window.addEventListener("resize", debounce(handleResize, 200), { passive: true });
    });
  }
  window.initExpandingFeaturePills = function () { addCss(); loadGsap(initExpandingFeaturePills); };
})();
