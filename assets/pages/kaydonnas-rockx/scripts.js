(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('rx-motion-ready');

  const heroVideo = document.querySelector('.rx-film-showcase > video');
  if (heroVideo && !reduceMotion) {
    heroVideo.muted = true;
    const startHeroVideo = () => heroVideo.play().catch(() => {});
    startHeroVideo();
    heroVideo.addEventListener('canplay', startHeroVideo, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) heroVideo.pause(); else startHeroVideo();
    });
    let ticking = false;
    const moveHero = () => {
      heroVideo.style.setProperty('--rx-hero-shift', `${Math.min(window.scrollY * .08, 38)}px`);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(moveHero); }
    }, { passive: true });
  }

  const motionTargets = document.querySelectorAll('.rx-section, .rx-exploded');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    motionTargets.forEach((target) => target.classList.add('rx-visible'));
  } else {
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('rx-visible');
        motionObserver.unobserve(entry.target);
      });
    }, { threshold: .12 });
    motionTargets.forEach((target) => motionObserver.observe(target));
  }

  document.querySelectorAll('.rx-config-option').forEach((option) => option.addEventListener('click', () => {
    document.querySelectorAll('.rx-config-option').forEach((button) => {
      const selected = button === option;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }));

  const dialog = document.querySelector('#rxFilm');
  const film = document.querySelector('#rxFullFilm');
  document.querySelectorAll('[data-film]').forEach((button) => button.addEventListener('click', () => {
    heroVideo?.pause();
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (!film.src) film.src = 'assets/pages/kaydonnas-rockx/video/hero-film.mp4';
    film.play().catch(() => {});
  }));
  function closeFilm() { if (dialog?.open) dialog.close(); }
  document.querySelector('#rxCloseFilm')?.addEventListener('click', closeFilm);
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) closeFilm(); });
  dialog?.addEventListener('close', () => {
    film.pause();
    if (!reduceMotion) heroVideo?.play().catch(() => {});
    document.body.style.overflow = '';
  });

  const infoBoxes = [...document.querySelectorAll('details.rx-info')];
  document.addEventListener('click', (event) => {
    const current = event.target.closest('details.rx-info');
    infoBoxes.forEach((box) => { if (box !== current) box.open = false; });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') infoBoxes.forEach((box) => { box.open = false; });
  });

  const tabs = [...document.querySelectorAll('[data-system]')];
  function selectTab(button) {
    tabs.forEach((tab) => {
      const active = tab === button;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
  }
  tabs.forEach((button, index) => {
    button.addEventListener('click', () => selectTab(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      selectTab(tabs[next]);
      tabs[next].focus();
    });
  });

  const portData = {
    right: { image: 'ports', alt: '右侧接口：四个 USB-A 与 RJ45 网口', items: [['USB 3.0', '1 × USB-A', '连接兼容的外接存储。', 37, 57], ['USB 2.0', '3 × USB-A', '连接键盘、鼠标等外设。', 50, 42], ['千兆以太网', '1 × RJ45', '连接路由器或交换机。', 65, 48]] },
    front: { image: 'glass', alt: '正面屏幕与前面板', items: [['前置屏幕', '正面窗口', '位于前面板下方。', 50, 52], ['前面板', '分体装配', '独立面板结构。', 52, 16], ['固定螺丝', '四角装配', '四角螺丝固定。', 18, 82]] },
    rear: { image: 'rear', alt: '后侧电源接口', items: [['电源开口', '后侧接口', '内凹电源开口。', 51, 47], ['后面板', '完整轮廓', '接口内凹安装。', 37, 30], ['固定结构', '独立面板', '螺丝固定接口面板。', 59, 47]] }
  };
  let currentView = 'right';
  function selectPort(index) {
    const item = portData[currentView].items[index];
    document.querySelector('#portDetail').textContent = item[2];
    document.querySelectorAll('[data-port]').forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.port) === index)));
  }
  function setView(key) {
    currentView = key;
    const data = portData[key];
    const image = document.querySelector('#portImage');
    image.src = `assets/pages/kaydonnas-rockx/images/${data.image}.webp`;
    image.alt = data.alt;
    document.querySelectorAll('[data-port-view]').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.portView === key)));
    document.querySelector('#portChoices').innerHTML = data.items.map((item, index) => `<button class="rx-port-choice" data-port="${index}" aria-pressed="${index === 0}"><span>0${index + 1}</span><span><strong>${item[0]}</strong><small>${item[1]}</small></span></button>`).join('');
    document.querySelector('#portHotspots').innerHTML = data.items.map((item, index) => `<button class="rx-hotspot" style="left:${item[3]}%;top:${item[4]}%" data-port="${index}" aria-label="${item[0]}" aria-pressed="${index === 0}">${index + 1}</button>`).join('');
    document.querySelectorAll('[data-port]').forEach((button) => button.addEventListener('click', () => selectPort(Number(button.dataset.port))));
    selectPort(0);
  }
  document.querySelectorAll('[data-port-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.portView)));
  if (document.querySelector('#portImage')) setView('right');
})();
