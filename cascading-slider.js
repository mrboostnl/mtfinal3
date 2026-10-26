// Osmo Cascading Slider (logic kept as supplied; GSAP loaded on demand, heading reveal applied inline).
(function () {
  function loadGsap(cb) {
    if (window.gsap) return cb();
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js';
    s.onload = cb; document.head.appendChild(s);
  }
  function setHeading(slide, active) {
    var h = slide.querySelector('[data-cascading-heading]'); if (!h) return;
    h.style.transitionDelay = active ? '400ms' : '0ms';
    h.style.opacity = active ? '1' : '0';
    h.style.transform = active ? 'translate(0px, 0em)' : 'translate(0, .25em)';
  }
  function initCascadingSlider() {
    var duration = 0.65, ease = 'power3.inOut';
    var breakpoints = [
      { maxWidth: 479, activeWidth: 0.72, siblingWidth: 0.08 },
      { maxWidth: 767, activeWidth: 0.56, siblingWidth: 0.10 },
      { maxWidth: 991, activeWidth: 0.46, siblingWidth: 0.12 },
      { maxWidth: Infinity, activeWidth: 0.38, siblingWidth: 0.13 }
    ];
    document.querySelectorAll('[data-cascading-slider-wrap]').forEach(function (wrapper) {
      if (wrapper.__cascInit) return; wrapper.__cascInit = true; setupInstance(wrapper);
    });
    function setupInstance(wrapper) {
      var viewport = wrapper.querySelector('[data-cascading-viewport]');
      var prevButton = wrapper.querySelector('[data-cascading-slider-prev]');
      var nextButton = wrapper.querySelector('[data-cascading-slider-next]');
      var slides = Array.from(viewport.querySelectorAll('[data-cascading-slide]'));
      var totalSlides = slides.length;
      if (totalSlides === 0) return;
      if (totalSlides < 9) {
        var originalSlides = slides.slice();
        while (slides.length < 9) {
          originalSlides.forEach(function (original) {
            var clone = original.cloneNode(true);
            clone.setAttribute('data-clone', '');
            viewport.appendChild(clone); slides.push(clone);
          });
        }
        totalSlides = slides.length;
      }
      var activeIndex = 0, isAnimating = false, slideWidth = 0, slotCenters = {}, slotWidths = {};
      function readGap() {
        var raw = getComputedStyle(viewport).getPropertyValue('--gap').trim();
        if (!raw) return 0;
        var temp = document.createElement('div');
        temp.style.width = raw; temp.style.position = 'absolute'; temp.style.visibility = 'hidden';
        viewport.appendChild(temp); var px = temp.offsetWidth; viewport.removeChild(temp); return px;
      }
      function getSettings() {
        var w = window.innerWidth;
        for (var i = 0; i < breakpoints.length; i++) if (w <= breakpoints[i].maxWidth) return breakpoints[i];
        return breakpoints[breakpoints.length - 1];
      }
      function getOffset(slideIndex, fromIndex) {
        if (fromIndex === undefined) fromIndex = activeIndex;
        var distance = slideIndex - fromIndex, half = totalSlides / 2;
        if (distance > half) distance -= totalSlides;
        if (distance < -half) distance += totalSlides;
        return distance;
      }
      function measure() {
        var settings = getSettings(), viewportWidth = viewport.offsetWidth, gap = readGap();
        var activeSlideWidth = viewportWidth * settings.activeWidth;
        var siblingSlideWidth = viewportWidth * settings.siblingWidth;
        var farSlideWidth = Math.max(0, (viewportWidth - activeSlideWidth - 2 * siblingSlideWidth - 4 * gap) / 2);
        slideWidth = activeSlideWidth;
        viewport.style.height = Math.round(activeSlideWidth) + 'px'; // square active slide
        var visibleSlots = [{ slot: -2, width: farSlideWidth }, { slot: -1, width: siblingSlideWidth }, { slot: 0, width: activeSlideWidth }, { slot: 1, width: siblingSlideWidth }, { slot: 2, width: farSlideWidth }];
        var x = 0;
        visibleSlots.forEach(function (def, i) {
          slotCenters[String(def.slot)] = x + def.width / 2; slotWidths[String(def.slot)] = def.width;
          if (i < visibleSlots.length - 1) x += def.width + gap;
        });
        slotCenters['-3'] = slotCenters['-2'] - farSlideWidth / 2 - gap - farSlideWidth / 2; slotWidths['-3'] = farSlideWidth;
        slotCenters['3'] = slotCenters['2'] + farSlideWidth / 2 + gap + farSlideWidth / 2; slotWidths['3'] = farSlideWidth;
        slides.forEach(function (slide) { slide.style.width = slideWidth + 'px'; });
      }
      function getSlideProps(offset) {
        var clamped = Math.max(-3, Math.min(3, offset));
        var slotWidth = slotWidths[String(clamped)];
        var clipAmount = Math.max(0, (slideWidth - slotWidth) / 2);
        var translateX = slotCenters[String(clamped)] - slideWidth / 2;
        return { x: translateX, '--clip': clipAmount, zIndex: 10 - Math.abs(clamped) };
      }
      function layout(animate, previousIndex) {
        slides.forEach(function (slide, index) {
          var offset = getOffset(index);
          if (offset < -3 || offset > 3) {
            if (animate && previousIndex !== undefined) {
              var previousOffset = getOffset(index, previousIndex);
              if (previousOffset >= -2 && previousOffset <= 2) {
                var exitSlot = previousOffset < 0 ? -3 : 3;
                gsap.to(slide, Object.assign({}, getSlideProps(exitSlot), { duration: duration, ease: ease, overwrite: true }));
                return;
              }
            }
            gsap.set(slide, getSlideProps(offset < 0 ? -3 : 3)); return;
          }
          var props = getSlideProps(offset);
          slide.setAttribute('data-status', offset === 0 ? 'active' : 'inactive');
          slide.style.cursor = offset === 0 ? 'default' : 'pointer';
          setHeading(slide, offset === 0);
          if (animate) gsap.to(slide, Object.assign({}, props, { duration: duration, ease: ease, overwrite: true }));
          else gsap.set(slide, props);
        });
      }
      function goTo(targetIndex) {
        var normalizedTarget = ((targetIndex % totalSlides) + totalSlides) % totalSlides;
        if (isAnimating || normalizedTarget === activeIndex) return;
        isAnimating = true;
        var previousIndex = activeIndex;
        var travelDirection = getOffset(normalizedTarget, previousIndex) > 0 ? 1 : -1;
        slides.forEach(function (slide, index) {
          var currentOffset = getOffset(index, previousIndex), nextOffset = getOffset(index, normalizedTarget);
          var wasInRange = currentOffset >= -3 && currentOffset <= 3, willBeVisible = nextOffset >= -2 && nextOffset <= 2;
          if (!wasInRange && willBeVisible) gsap.set(slide, getSlideProps(travelDirection > 0 ? 3 : -3));
          var wasInvisible = Math.abs(currentOffset) >= 3, willBeStaging = Math.abs(nextOffset) === 3, crossesSides = currentOffset * nextOffset < 0;
          if (wasInvisible && willBeStaging && crossesSides) gsap.set(slide, getSlideProps(nextOffset > 0 ? 3 : -3));
        });
        activeIndex = normalizedTarget;
        layout(true, previousIndex);
        gsap.delayedCall(duration + 0.05, function () { isAnimating = false; });
      }
      wrapper.__goTo = function (d) { goTo(activeIndex + d); };
      if (prevButton) prevButton.addEventListener('click', function () { goTo(activeIndex - 1); });
      if (nextButton) nextButton.addEventListener('click', function () { goTo(activeIndex + 1); });
      slides.forEach(function (slide, index) { slide.addEventListener('click', function () { if (index !== activeIndex) goTo(index); }); });
      document.addEventListener('keydown', function (event) {
        var t = event.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
        if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
        if (event.key === 'ArrowRight') goTo(activeIndex + 1);
      });
      var resizeTimer;
      window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { measure(); layout(false); }, 100); });
      measure(); layout(false);
    }
  }
  window.initCascadingSlider = function () { loadGsap(initCascadingSlider); };
})();
