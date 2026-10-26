(function () {
  if (customElements.get('mt-mobile-nav')) return;
  const SITE = 'https://www.mthekwerken.nl';
  const CSS = `
.drawer-nav{--drawer-nav-width:30em;--drawer-nav-edge:3.5em;z-index:200;color:#11131F;position:relative;font-family:'Outfit',system-ui,sans-serif;font-size:16px;-webkit-font-smoothing:antialiased}
.drawer-nav *{box-sizing:border-box}
.drawer-nav__bar{z-index:202;pointer-events:none;justify-content:space-between;align-items:center;padding:12px 16px;display:flex;position:fixed;top:0;left:0;right:0;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s}
.drawer-nav[data-drawer-nav-open="true"] .drawer-nav__bar{opacity:1;visibility:visible}
.drawer-nav__logo{pointer-events:auto;color:inherit;display:flex;align-items:center;gap:8px;font-weight:700;font-size:19px;letter-spacing:-.02em;text-decoration:none}
.drawer-nav__logo img{width:34px;height:34px;display:block}
.drawer-nav__actions{pointer-events:auto;gap:.25em;align-items:center;display:flex}
.drawer-nav__bag{color:inherit;border-radius:8px;padding:.75em 1em;line-height:1;text-decoration:none;font-size:15px;transition:background-color .3s cubic-bezier(.625,.05,0,1)}
.drawer-nav__bag:hover,.drawer-nav__bag:focus-visible{background-color:#11131F14}
.drawer-nav__toggle,.mt-nav-trigger{gap:.625em;color:#F7F5F1;background-color:#11131F;border-style:none;border-radius:8px;align-items:center;padding:.8em 1.1em;font:inherit;font-family:'Outfit',system-ui,sans-serif;font-size:15px;font-weight:500;display:flex;cursor:pointer}
.drawer-nav__toggle-text{flex-direction:column;height:1em;display:flex;overflow:hidden}
.drawer-nav__toggle-label{line-height:1;display:block;transition:transform .5s cubic-bezier(.625,.05,0,1)}
[data-drawer-nav-init][data-drawer-nav-open="true"] .drawer-nav__toggle-label,mt-mobile-nav[data-drawer-nav-open="true"] .drawer-nav__toggle-label{transform:translate(0,-100%)}
.drawer-nav__toggle-icon{gap:.25em;flex-direction:column;width:.875em;display:flex}
.drawer-nav__toggle-bar{background-color:currentColor;width:100%;height:.1em;min-height:1.5px;padding:0;display:block;transition:transform .35s ease}
[data-drawer-nav-init][data-drawer-nav-open="true"] .drawer-nav__toggle-bar:first-child,mt-mobile-nav[data-drawer-nav-open="true"] .drawer-nav__toggle-bar:first-child{transform:translate(0,.175em) rotate(45deg)}
[data-drawer-nav-init][data-drawer-nav-open="true"] .drawer-nav__toggle-bar:last-child,mt-mobile-nav[data-drawer-nav-open="true"] .drawer-nav__toggle-bar:last-child{transform:translate(0,-.175em) rotate(-45deg)}
.drawer-nav__backdrop{z-index:200;opacity:0;visibility:hidden;background-color:#11131F66;position:fixed;inset:0;cursor:pointer}
.drawer-nav__drawer{z-index:201;visibility:hidden;background-color:#F7F5F1;width:var(--drawer-nav-width,30em);position:fixed;top:0;bottom:0;right:0;overflow:hidden}
.drawer-nav__sheet{z-index:2;visibility:hidden;background-color:#F7F5F1;border-left:1px solid #E6E2DA;position:absolute;top:0;bottom:0;left:var(--drawer-nav-edge,3.5em);right:0;box-shadow:-1em 0 2em #11131F0f}
.drawer-nav__edge{z-index:1;visibility:hidden;opacity:0;color:inherit;background-color:#ECE8E1;border-style:none;flex-direction:column;justify-content:flex-start;align-items:center;width:var(--drawer-nav-edge,3.5em);padding:6.5em 0 2em;font:inherit;display:flex;position:absolute;top:0;bottom:0;left:0;cursor:pointer;transition:background-color .2s ease}
.drawer-nav__edge:hover,.drawer-nav__edge:focus-visible{background-color:#E6E1D8}
.drawer-nav__edge-icon{flex:none;width:1.25em}
.drawer-nav__content{gap:2em;overscroll-behavior:contain;flex-direction:column;height:100%;padding:6.5em 2em 2em;display:flex;overflow:auto}
.drawer-nav__head{gap:1em;flex-direction:column;align-items:flex-start;display:flex}
.drawer-nav__back{gap:.25em;color:#11131F99;background-color:transparent;border-style:none;align-items:center;margin-left:-.25em;padding:0;font-family:inherit;font-style:inherit;font-weight:inherit;font-size:inherit;line-height:1;display:flex;cursor:pointer;transition:color .3s cubic-bezier(.625,.05,0,1)}
.drawer-nav__back:hover,.drawer-nav__back:focus-visible{color:#11131F}
.drawer-nav__back-icon{width:1.25em}
.drawer-nav__back-label{font-size:1em}
.drawer-nav__title{letter-spacing:-.03em;margin:0;font-size:2.75em;font-weight:600;line-height:1}
.drawer-nav__collection{width:100%}
.drawer-nav__list{flex-direction:column;margin:0;padding-left:0;list-style-type:none;display:flex}
.drawer-nav__item{display:block}
.drawer-nav__link{color:inherit;text-align:left;letter-spacing:-.02em;background-color:transparent;border-style:none;justify-content:space-between;align-items:center;width:100%;padding:.25em 0;font-family:inherit;font-size:2em;font-weight:500;line-height:1.125;text-decoration:none;display:flex;cursor:pointer}
.drawer-nav__link:hover,.drawer-nav__link:focus-visible{color:#FB7029}
.drawer-nav__link-label{display:flex;align-items:center;gap:.5em}.drawer-nav__thumb{flex:none;width:1.55em;height:1.55em;border-radius:50%;background:#E3ECF5;display:grid;place-items:center;overflow:hidden}.drawer-nav__thumb img{width:78%;height:78%;object-fit:contain;mix-blend-mode:multiply;display:block}.drawer-nav__thumb.is-photo img{width:100%;height:100%;object-fit:cover;mix-blend-mode:normal}
.drawer-nav__link-icon{flex:none;width:.75em}
.drawer-nav__list--root{gap:.35em}
.drawer-nav__list--root > .drawer-nav__item > .drawer-nav__link{padding:.3em 0}
.drawer-nav__group{gap:1em;flex-direction:column;display:flex}
.drawer-nav__group-label{color:#11131F8c;text-transform:uppercase;letter-spacing:.08em;font-size:.75em;font-weight:600;line-height:1}
.drawer-nav__group-collection{width:100%}
.drawer-nav__group-list{gap:.625em;flex-direction:column;margin:0;padding-left:0;list-style-type:none;display:flex}
.drawer-nav__group-item{display:block}
.drawer-nav__group-link{color:inherit;font-size:1.125em;line-height:1.222;text-decoration:none;transition:color .3s cubic-bezier(.625,.05,0,1)}
.drawer-nav__group-link:hover,.drawer-nav__group-link:focus-visible{color:#FB7029}
.drawer-nav__more{color:inherit;align-self:flex-start;line-height:1.25;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:.6em}.drawer-nav__more::after{content:"";width:1.8em;height:1.8em;border-radius:50%;background:#FB7029 url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272.6%27 stroke-linecap=%27round%27%3E%3Cpath d=%27M5 12h14M13 6l6 6-6 6%27/%3E%3C/svg%3E") center/50% no-repeat}
.drawer-nav__more:hover,.drawer-nav__more:focus-visible{text-decoration-color:transparent;color:inherit}
.drawer-nav__promo{gap:1em;color:inherit;background-color:#F1EEE8;border-radius:8px;align-items:stretch;margin-top:auto;padding:.5em;text-decoration:none;display:flex;transition:background-color .3s cubic-bezier(.625,.05,0,1)}
.drawer-nav__promo:hover,.drawer-nav__promo:focus-visible{background-color:#E2DDD4;color:inherit}
.drawer-nav__promo-visual{aspect-ratio:1;border-radius:6px;flex:none;width:7.5em;display:block;overflow:hidden}
.drawer-nav__promo-img{object-fit:cover;width:100%;height:100%;display:block}
.drawer-nav__promo-text{gap:.375em;flex-direction:column;justify-content:center;padding-right:.5em;display:flex}
.drawer-nav__promo-title{font-size:1.125em;font-weight:600;line-height:1.222}
.drawer-nav__promo-desc{color:#11131F99;font-size:.875em;line-height:1.286}
.drawer-nav__promo-cta{margin-top:.35em;font-size:.875em;font-weight:600;line-height:1.143;display:flex;align-items:center;gap:.5em}.drawer-nav__promo-cta::after{content:"";width:1.7em;height:1.7em;border-radius:50%;background:#FB7029 url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272.6%27 stroke-linecap=%27round%27%3E%3Cpath d=%27M5 12h14M13 6l6 6-6 6%27/%3E%3C/svg%3E") center/52% no-repeat}
.drawer-nav__footer{gap:.75em 1.5em;border-top:1px solid #11131F1f;flex-wrap:wrap;padding-top:1.25em;display:flex}
.drawer-nav__footer-link{color:#11131F99;font-size:.875em;line-height:1.286;text-decoration:none;transition:color .3s cubic-bezier(.625,.05,0,1)}
.drawer-nav__footer-link:hover,.drawer-nav__footer-link:focus-visible{color:#11131F}
.drawer-nav__footer{align-items:center}
.drawer-nav__lang{position:relative;margin-left:auto}
.drawer-nav__flag{flex:none;width:1.5em;height:1.5em;border-radius:50%;display:block;box-shadow:inset 0 0 0 1px #11131F1f}
.drawer-nav__flag--nl{background:linear-gradient(#AE1C28 0 33.3%,#fff 0 66.6%,#21468B 0)}
.drawer-nav__flag--be{background:linear-gradient(90deg,#1D1D1F 0 33.3%,#FDDA24 0 66.6%,#EF3340 0)}
.drawer-nav__flag--de{background:linear-gradient(#1D1D1F 0 33.3%,#DD0000 0 66.6%,#FFCE00 0)}
.drawer-nav__lang-btn{width:2.75em;height:2.75em;border-radius:50%;border:1px solid #E1DCD2;background:#fff;display:grid;place-items:center;cursor:pointer;padding:0;transition:border-color .2s,transform .3s cubic-bezier(.625,.05,0,1)}
.drawer-nav__lang-btn:hover{border-color:#11131F}
.drawer-nav__lang-btn .drawer-nav__flag{width:1.625em;height:1.625em}
.drawer-nav__lang-pop{position:absolute;right:0;bottom:calc(100% + .625em);min-width:13em;background:#fff;border-radius:12px;padding:.375em;box-shadow:0 1em 2.5em #11131F29,0 0 0 1px #11131F0f;display:flex;flex-direction:column;opacity:0;visibility:hidden;transform:translateY(.5em) scale(.97);transform-origin:bottom right;transition:opacity .25s ease,transform .35s cubic-bezier(.625,.05,0,1),visibility .35s}
.drawer-nav__lang[data-open="true"] .drawer-nav__lang-pop{opacity:1;visibility:visible;transform:none}
.drawer-nav__lang-label{padding:.625em .75em .375em;color:#11131F8c;text-transform:uppercase;letter-spacing:.08em;font-size:.6875em;font-weight:600}
.drawer-nav__lang-opt{display:flex;align-items:center;gap:.75em;padding:.625em .75em;border-radius:8px;color:#11131F;text-decoration:none;font-size:.9375em;font-weight:500}
.drawer-nav__lang-opt:hover,.drawer-nav__lang-opt:focus-visible{background:#F7F5F1;color:#11131F}
.drawer-nav__lang-opt small{margin-left:auto;color:#11131F80;font-size:.8em;font-weight:400}
.drawer-nav__lang-opt[aria-current="true"] small{color:#FB7029;font-weight:600}
.drawer-nav :focus-visible,.mt-nav-trigger:focus-visible{outline:2px solid #FB7029;outline-offset:2px}
@media screen and (max-width:767px){
.drawer-nav{--drawer-nav-width:100%;--drawer-nav-edge:2.5em}
.drawer-nav__edge{padding-top:5.5em}
.drawer-nav__content{padding:5.5em 1.25em 1.25em}
.drawer-nav__title{font-size:2.25em}
.drawer-nav__link{font-size:1.5em;line-height:1.083}
.drawer-nav__promo-visual{width:6em}
.drawer-nav__promo-title{font-size:1em;line-height:1.25}
}`;

  const chevR = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 20 20" fill="none" class="drawer-nav__link-icon"><path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  const chevL = (cls) => '<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 20 20" fill="none" class="' + cls + '"><path d="M12 5L7 10L12 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  const u = (p) => (p.startsWith('http') ? p : SITE + p);
  const th = (img) => img ? '<span class="drawer-nav__thumb' + (img.photo ? ' is-photo' : '') + '"><img src="' + (img.src || img) + '" alt="" loading="lazy"></span>' : '';
  const link = (l, h, img) => '<li data-drawer-nav-reveal class="drawer-nav__item"><a href="' + u(h) + '" class="drawer-nav__link"><span class="drawer-nav__link-label">' + th(img) + l + '</span></a></li>';
  const group = (label, items) => '<div data-drawer-nav-reveal class="drawer-nav__group"><span class="drawer-nav__group-label">' + label + '</span><div class="drawer-nav__group-collection"><ul class="drawer-nav__group-list">' + items.map(([l, h]) => '<li class="drawer-nav__group-item"><a href="' + u(h) + '" class="drawer-nav__group-link">' + l + '</a></li>').join('') + '</ul></div></div>';
  const sheet = (label, back, items, more, extra, img) => '<li data-drawer-nav-reveal class="drawer-nav__item"><button data-drawer-nav-trigger class="drawer-nav__link"><span class="drawer-nav__link-label">' + th(img) + label + '</span>' + chevR + '</button>' +
    '<div data-drawer-nav-sheet data-preview="false" class="drawer-nav__sheet"><button data-drawer-nav-edge aria-label="Terug naar ' + label.toLowerCase() + '" class="drawer-nav__edge">' + chevL('drawer-nav__edge-icon') + '</button>' +
    '<div class="drawer-nav__content"><div class="drawer-nav__head"><button data-drawer-nav-back data-drawer-nav-reveal class="drawer-nav__back">' + chevL('drawer-nav__back-icon') + '<span class="drawer-nav__back-label">' + back + '</span></button><h2 data-drawer-nav-reveal class="drawer-nav__title">' + label + '</h2></div>' +
    '<div class="drawer-nav__collection"><ul class="drawer-nav__list">' + items.join('') + '</ul></div>' + (extra || '') + (more ? '<a data-drawer-nav-reveal href="' + u(more[1]) + '" class="drawer-nav__more">' + more[0] + '</a>' : '') + '</div></div></li>';
  const toggleInner = '<span class="drawer-nav__toggle-text"><span class="drawer-nav__toggle-label">Menu</span><span class="drawer-nav__toggle-label">Sluiten</span></span><span class="drawer-nav__toggle-icon"><span class="drawer-nav__toggle-bar"></span><span class="drawer-nav__toggle-bar"></span></span>';

  const W = 'https://www.mthekwerken.nl/wp-content/uploads/';
  const I = { dsm: W + '100cm.724.1-scaled-5-533x533.jpg', dsmz: W + '80cm.727.1-zwart-scaled-6.jpg', sp: W + 'Industriehekwerk_glad-6-533x543.png', poort: W + 'Liga-lp-5.jpg', paal: W + 'Aantekening-2019-12-12-155140-5-533x537.png', beugel: W + 'Dubbelstaafmat-eindbeugel-270x210_0-5.jpg', deur: ((window.__resources && window.__resources['nav_p_deur_png']) || 'assets/p-deur.png'), cpaal: ((window.__resources && window.__resources['nav_p_paal_png']) || 'assets/p-paal.png'), schutting: { src: ((window.__resources && window.__resources['nav_panel_jpg']) || 'assets/panel.jpg'), photo: true }, gevel: { src: ((window.__resources && window.__resources['nav_af_lamellen_png']) || 'assets/af-lamellen.png'), photo: true }, vlonder: { src: ((window.__resources && window.__resources['nav_af_houtnerf_png']) || 'assets/af-houtnerf.png'), photo: true } };
  const HELP = (conf) => group('Hulp bij kiezen', (conf ? [['Configurator', '/configurator/']] : []).concat([['Offerte aanvragen', '/offerte-aanvragen/'], ['Montagehandleidingen', '/klantenservice/montagehandleidingen/'], ['Klantenservice', '/klantenservice/']]));
  const M = (label, img, rows, conf) => sheet(label, 'Menu', rows.map(([l, h, i]) => link(l, h, i)), null, HELP(conf), img);
  const MENU =
    M('Dubbelstaafmat hekwerk', I.dsmz, [['Bekijk alle dubbelstaafmatten', '/hekwerk/dubbelstaafmatten/', I.dsm], ['Dubbelstaafmat 6/5/6', '/product/dubbelstaafmat-6-5-6/', I.dsmz], ['Dubbelstaafmat 8/6/8', '/product/dubbelstaafmat-8-6-8/', I.dsm], ['Dubbelstaafmat poorten', '/hekwerk/dubbelstaafmatten/dubbelstaafmat-poorten/', I.poort], ['Palen en onderdelen', '/hekwerk/dubbelstaafmatten/dubbelstaafmat-onderdelen/', I.beugel]], true) +
    M('Composiet schuttingen', I.schutting, [['Bekijk alle composiet schuttingen', '/composiet-schuttingen/', I.schutting], ['Composiet tuindeuren / poorten', '/composiet-schuttingen/composiet-tuindeuren/', I.deur], ['Schuttingpalen en onderdelen', '/composiet-schuttingen/composiet-schutting-onderdelen/', I.cpaal], ['Samples bestellen', '/samples-bestellen/', I.schutting]], true) +
    M('Composiet gevelbekleding', I.gevel, [['Bekijk alle gevelbekleding', '/composiet-gevelbekleding/', I.gevel], ['Gevelbekleding samples', '/composiet-gevelbekleding/gevelbekleding-samples/', I.gevel], ['Regelwerk', '/composiet-gevelbekleding/regelwerk/', I.cpaal], ['Eind- en hoekprofielen', '/composiet-gevelbekleding/eind-en-hoekprofielen/', I.cpaal]], false) +
    M('Spijlenhekwerk', I.sp, [['Bekijk alle spijlenhekwerken', '/hekwerk/spijlen-hekwerk/', I.sp], ['Spijlenhekwerk poorten', '/hekwerk/spijlen-hekwerk/spijlenhekwerk-poorten/', I.poort], ['Palen en onderdelen', '/hekwerk/spijlen-hekwerk/spijlenhekwerk-onderdelen/', I.paal]], true) +
    M('Composiet vlonderplanken', I.vlonder, [['Bekijk alle vlonderplanken', '/composiet-vlonderplanken/', I.vlonder], ['Semi-massieve vlonderplanken', '/composiet-vlonderplanken/semi-massieve-vlonderplanken/', I.vlonder], ['Naadloos massieve vlonderplanken', '/composiet-vlonderplanken/massieve-vlonderplanken/', I.vlonder], ['Vlonder onderdelen en afwerking', '/composiet-vlonderplanken/vlonder-onderdelen/', I.cpaal], ['Samples bestellen', '/samples-bestellen/', I.vlonder]], false) +
    M('Poorten', I.poort, [['Bekijk alle poorten', '/poorten/', I.poort], ['Composiet poorten / tuindeuren', '/composiet-schuttingen/composiet-tuindeuren/', I.deur], ['Dubbelstaafmat poorten', '/hekwerk/dubbelstaafmatten/dubbelstaafmat-poorten/', I.poort], ['Spijlenhekwerk poorten', '/hekwerk/spijlen-hekwerk/spijlenhekwerk-poorten/', I.sp]], true);

  const OVERLAY =
    '<div class="drawer-nav__bar"><a href="' + SITE + '" aria-label="Home" class="drawer-nav__logo"><img src="' + ((window.__resources && window.__resources['nav_mt_mark_svg']) || 'assets/mt-mark.svg') + '" alt="">MT hekwerken</a>' +
    '<div class="drawer-nav__actions"><a href="' + SITE + '/winkelwagen/" class="drawer-nav__bag">Winkelwagen</a><button data-drawer-nav-toggle aria-expanded="false" aria-label="Menu sluiten" class="drawer-nav__toggle">' + toggleInner + '</button></div></div>' +
    '<div data-drawer-nav-backdrop class="drawer-nav__backdrop"></div>' +
    '<div data-drawer-nav-drawer class="drawer-nav__drawer" role="dialog" aria-modal="true" aria-label="Menu"><button data-drawer-nav-edge aria-label="Terug naar menu" class="drawer-nav__edge">' + chevL('drawer-nav__edge-icon') + '</button>' +
    '<div class="drawer-nav__content"><div class="drawer-nav__collection"><ul class="drawer-nav__list drawer-nav__list--root">' + MENU + '</ul></div>' +
    '<a data-drawer-nav-reveal href="' + SITE + '/configurator/" class="drawer-nav__promo"><span class="drawer-nav__promo-visual"><img src="' + ((window.__resources && window.__resources['nav_install_jpg']) || 'assets/install.jpg') + '" alt="Hekwerk plaatsen" class="drawer-nav__promo-img"></span><span class="drawer-nav__promo-text"><span class="drawer-nav__promo-title">Stel je hekwerk samen</span><span class="drawer-nav__promo-desc">Bereken panelen, palen en bevestigingen voor jouw situatie.</span><span class="drawer-nav__promo-cta">Naar de configurator</span></span></a>' +
    '<div data-drawer-nav-reveal class="drawer-nav__footer"><a href="tel:+31855808704" class="drawer-nav__footer-link">+31 85 580 8704</a><a href="' + SITE + '/contact/" class="drawer-nav__footer-link">Contact</a><a href="' + SITE + '/mijn-account/" class="drawer-nav__footer-link">Account</a>' + '<div class="drawer-nav__lang" data-open="false"><div class="drawer-nav__lang-pop" role="menu" aria-label="Kies land en taal"><span class="drawer-nav__lang-label">Land / taal</span>' +
      '<a role="menuitem" aria-current="true" href="https://www.mthekwerken.nl" class="drawer-nav__lang-opt"><span class="drawer-nav__flag drawer-nav__flag--nl"></span>Nederland<small>Actief</small></a>' +
      '<a role="menuitem" href="https://www.mthekwerken.be" class="drawer-nav__lang-opt"><span class="drawer-nav__flag drawer-nav__flag--be"></span>België<small>.be</small></a>' +
      '<a role="menuitem" href="https://mtzaune.de" class="drawer-nav__lang-opt"><span class="drawer-nav__flag drawer-nav__flag--de"></span>Deutschland<small>.de</small></a></div>' +
      '<button type="button" class="drawer-nav__lang-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Taal: Nederland. Wijzig land of taal"><span class="drawer-nav__flag drawer-nav__flag--nl"></span></button></div>' + '</div>' +
    '</div></div>';

  let gsapLoading = null;
  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  const ensureGsap = () => {
    if (window.gsap && window.CustomEase) return Promise.resolve();
    if (!gsapLoading) gsapLoading = (window.gsap ? Promise.resolve() : loadScript('https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js')).then(() => (window.CustomEase ? null : loadScript('https://cdn.jsdelivr.net/npm/gsap@3.15/dist/CustomEase.min.js')));
    return gsapLoading;
  };

  function initStackedDrawerNavigation(nav, extraToggles, onState) {
    const gsap = window.gsap;
    gsap.registerPlugin(window.CustomEase);
    window.CustomEase.create('osmo', 'M0,0 C0.625,0.05 0,1 1,1');
    let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const toggles = [...nav.querySelectorAll('[data-drawer-nav-toggle]'), ...extraToggles];
    const backdrop = nav.querySelector('[data-drawer-nav-backdrop]');
    const drawer = nav.querySelector('[data-drawer-nav-drawer]');
    const levelSelector = '[data-drawer-nav-drawer], [data-drawer-nav-sheet]';
    const levelElements = (level, selector) => [...level.querySelectorAll(selector)].filter((el) => el.closest(levelSelector) === level);
    const sheets = [], parentOf = new Map(), triggerOf = new Map();
    const uid = Math.random().toString(36).slice(2, 7);

    drawer.querySelectorAll('[data-drawer-nav-trigger]').forEach((trigger, index) => {
      const sheet = [...trigger.parentElement.children].find((el) => el.matches('[data-drawer-nav-sheet]'));
      if (!sheet) return;
      const parent = trigger.closest(levelSelector);
      parent.appendChild(sheet);
      sheet.id = sheet.id || 'drawer-nav-' + uid + '-sheet-' + index;
      trigger.setAttribute('aria-controls', sheet.id);
      sheets.push(sheet); parentOf.set(sheet, parent); triggerOf.set(sheet, trigger);
      trigger.addEventListener('click', () => openSheet(sheet));
    });

    const levels = [drawer, ...sheets];
    const edges = levels.flatMap((level) => levelElements(level, '[data-drawer-nav-edge]'));
    const stack = [drawer];
    let isOpen = false;

    function updateLevels() {
      const activeLevel = stack[stack.length - 1];
      levels.forEach((level) => {
        const status = level === activeLevel ? 'active' : stack.includes(level) ? 'behind' : 'closed';
        level.setAttribute('data-drawer-nav-status', status);
        [...level.children].filter((c) => !c.matches('[data-drawer-nav-edge], [data-drawer-nav-sheet]')).forEach((c) => { c.inert = status === 'behind'; });
      });
      sheets.forEach((s) => triggerOf.get(s).setAttribute('aria-expanded', String(stack.includes(s))));
    }
    function resetLevels() {
      stack.splice(1);
      gsap.killTweensOf([...sheets, ...edges]);
      gsap.set(sheets, { autoAlpha: 0, xPercent: 0 });
      gsap.set(edges, { autoAlpha: 0 });
      updateLevels();
    }
    function openSheet(sheet) {
      if (stack.includes(sheet)) return;
      const parent = parentOf.get(sheet);
      stack.push(sheet); updateLevels();
      gsap.timeline({ defaults: { ease: 'osmo', overwrite: true } })
        .fromTo(sheet, { xPercent: reduceMotion ? 0 : 100, autoAlpha: reduceMotion ? 0 : 1 }, { xPercent: 0, autoAlpha: 1, duration: 0.7 }, 0)
        .fromTo(levelElements(parent, '[data-drawer-nav-edge]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.25)
        .fromTo(levelElements(sheet, '[data-drawer-nav-reveal]'), { opacity: 0, xPercent: reduceMotion ? 0 : 15 }, { opacity: 1, xPercent: 0, duration: 0.6, stagger: 0.03 }, 0);
      const first = levelElements(sheet, 'a[href], button').find((el) => !el.matches('[data-drawer-nav-edge]'));
      if (first) first.focus({ preventScroll: true });
    }
    function closeTo(level) {
      const index = stack.indexOf(level);
      if (index < 0 || index === stack.length - 1) return;
      const closing = stack.splice(index + 1);
      const hadFocus = drawer.contains(document.activeElement);
      updateLevels();
      gsap.timeline({ defaults: { ease: 'osmo', overwrite: true }, onComplete: () => {
        const closed = closing.filter((s) => !stack.includes(s));
        gsap.set(closed, { autoAlpha: 0, xPercent: 0 });
        gsap.set(closed.flatMap((s) => levelElements(s, '[data-drawer-nav-edge]')), { autoAlpha: 0 });
      } })
        .to(closing[0], { xPercent: reduceMotion ? 0 : 100, autoAlpha: reduceMotion ? 0 : 1, duration: 0.6 }, 0)
        .to(levelElements(level, '[data-drawer-nav-edge]'), { autoAlpha: 0, duration: 0.3 }, 0);
      if (hadFocus) triggerOf.get(closing[0]).focus({ preventScroll: true });
    }
    function finishClose() { gsap.set(drawer, { visibility: 'hidden' }); resetLevels(); }
    function goBack(level) { const p = parentOf.get(level); if (p) closeTo(p); else setOpen(false); }

    resetLevels();
    const tl = gsap.timeline({ paused: true, onReverseComplete: finishClose, defaults: { ease: 'osmo', easeReverse: 'power2.inOut' } });
    tl.set(drawer, { visibility: 'visible' }, 0)
      .fromTo(drawer, { xPercent: reduceMotion ? 0 : 100, opacity: reduceMotion ? 0 : 1 }, { xPercent: 0, opacity: 1, duration: 0.8 }, 0)
      .fromTo(levelElements(drawer, '[data-drawer-nav-reveal]'), { opacity: 0, xPercent: reduceMotion ? 0 : 15 }, { opacity: 1, xPercent: 0, duration: 0.6, stagger: 0.04 }, 0.1);
    if (backdrop) tl.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0);
    const openEnd = tl.duration();
    tl.addPause();
    tl.to(drawer, { xPercent: reduceMotion ? 0 : 100, opacity: reduceMotion ? 0 : 1, duration: 0.6, ease: 'power3.inOut' });
    if (backdrop) tl.to(backdrop, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, '<');
    tl.call(finishClose);

    function setOpen(open) {
      isOpen = open;
      nav.setAttribute('data-drawer-nav-open', String(open));
      toggles.forEach((t) => t.setAttribute('aria-expanded', String(open)));
      onState(open);
      if (open) {
        if (tl.time() >= openEnd) { resetLevels(); tl.restart(); } else tl.play();
        const first = levelElements(drawer, 'a[href], button').find((el) => !el.matches('[data-drawer-nav-edge]'));
        if (first) setTimeout(() => first.focus({ preventScroll: true }), 50);
      } else if (tl.time() < openEnd) tl.reverse();
      else tl.play();
    }
    toggles.forEach((t) => t.addEventListener('click', () => setOpen(!isOpen)));
    if (backdrop) backdrop.addEventListener('click', () => setOpen(false));
    levels.forEach((level) => {
      levelElements(level, '[data-drawer-nav-edge]').forEach((e) => e.addEventListener('click', () => closeTo(level)));
      levelElements(level, '[data-drawer-nav-back]').forEach((b) => b.addEventListener('click', () => goBack(level)));
    });
    const onKey = (event) => {
      if (event.key !== 'Escape' || !isOpen) return;
      if (stack.length > 1) closeTo(stack[stack.length - 2]);
      else { setOpen(false); if (extraToggles[0]) extraToggles[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    const lang = nav.querySelector('.drawer-nav__lang'), langBtn = lang && lang.querySelector('.drawer-nav__lang-btn');
    const setLang = (o) => { lang.setAttribute('data-open', String(o)); langBtn.setAttribute('aria-expanded', String(o)); };
    if (lang) {
      langBtn.addEventListener('click', (e) => { e.stopPropagation(); setLang(lang.getAttribute('data-open') !== 'true'); });
      nav.addEventListener('click', (e) => { if (!lang.contains(e.target)) setLang(false); });
      lang.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lang.getAttribute('data-open') === 'true') { e.stopPropagation(); setLang(false); langBtn.focus(); } });
    }
    return { close: () => { if (isOpen) setOpen(false); }, destroy: () => { document.removeEventListener('keydown', onKey); tl.kill(); } };
  }

  class MtMobileNav extends HTMLElement {
    connectedCallback() {
      if (this._ready) return; this._ready = true;
      if (!document.getElementById('mt-mobile-nav-css')) { const st = document.createElement('style'); st.id = 'mt-mobile-nav-css'; st.textContent = CSS; document.head.appendChild(st); }
      this.style.display = 'inline-flex';
      this.innerHTML = '<button type="button" class="mt-nav-trigger" aria-expanded="false" aria-label="Menu" aria-haspopup="dialog">' + toggleInner + '</button>';
      const overlay = document.createElement('nav');
      overlay.className = 'drawer-nav'; overlay.setAttribute('data-drawer-nav-init', ''); overlay.setAttribute('data-drawer-nav-open', 'false'); overlay.setAttribute('data-preview', 'false'); overlay.setAttribute('aria-label', 'Hoofdmenu');
      overlay.innerHTML = OVERLAY;
      document.body.appendChild(overlay);
      this._overlay = overlay;
      const trigger = this.querySelector('.mt-nav-trigger');
      ensureGsap().then(() => {
        if (!this._overlay) return;
        this._api = initStackedDrawerNavigation(overlay, [trigger], (open) => {
          this.setAttribute('data-drawer-nav-open', String(open));
          document.documentElement.style.overflow = open ? 'hidden' : '';
        });
      });
    }
    disconnectedCallback() {
      if (this._api) this._api.destroy();
      if (this._overlay) this._overlay.remove();
      this._overlay = null; this._api = null; this._ready = false;
      document.documentElement.style.overflow = '';
    }
  }
  customElements.define('mt-mobile-nav', MtMobileNav);
})();
