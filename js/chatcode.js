(() => {
  const scene = document.querySelector('.chatcode-cinematic');
  if (!scene) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const glyph = (path, className = '') => `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
  const icons = {
    chat: 'M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3H3V6a2 2 0 0 1 2-2ZM7 9h10M7 13h6',
    pin: 'm9 3 6 0-1 6 4 4v2H6v-2l4-4-1-6ZM12 15v7',
    send: 'm5 12 7-7 7 7M12 5v15',
    copy: 'M9 9h11v12H9ZM15 9V3H3v12h6',
    spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
    check: 'm5 12 4 4L19 6',
    sliders: 'M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6',
    plus: 'M12 4v16M4 12h16'
  };
  const lines = (n = 3) => `<div class="ui-lines">${Array.from({ length: n }, (_, i) => `<i style="--line:${[92, 76, 86, 53][i % 4]}%"></i>`).join('')}</div>`;
  const bar = '<div class="ui-windowbar"><img src="assets/images/chatcode-logo.png" alt=""><i></i><div><b></b><b></b><b></b></div></div>';
  const content = {
    history: () => `<div class="ui-mini-heading">${glyph(icons.chat)}<i></i>${glyph(icons.plus)}</div><div class="ui-history">${Array.from({ length: 5 }, (_, i) => `<div class="${i === 1 ? 'selected' : ''}"><span>${glyph(i === 1 ? icons.pin : icons.chat)}</span>${lines(2)}${i < 2 ? glyph(icons.pin) : '<b></b>'}</div>`).join('')}</div>`,
    conversation: () => `<div class="ui-message user"><i></i>${lines(2)}</div><div class="ui-message assistant"><img src="assets/images/chatcode-logo.png" alt="">${lines(4)}</div><div class="ui-message user second"><i></i>${lines(2)}</div><div class="ui-message assistant"><img src="assets/images/chatcode-logo.png" alt="">${lines(3)}</div><div class="ui-tools">${glyph(icons.copy)}${glyph(icons.check)}<i></i></div>`,
    material: () => `<div class="ui-material"><div></div><div></div><div></div><img src="assets/images/chatcode-logo.png" alt=""></div><div class="ui-material-foot">${glyph(icons.spark)}${lines(2)}</div>`,
    composer: () => `<div class="ui-mini-heading">${glyph(icons.spark)}<i></i></div>${lines(2)}<div class="ui-composer">${lines(1)}<div>${glyph(icons.plus)}<span class="ui-connected"></span><b>${glyph(icons.send)}</b></div></div>`,
    settings: () => `<div class="ui-mini-heading">${glyph(icons.sliders)}<i></i></div><div class="ui-settings">${[65, 40, 78].map((v, i) => `<div>${lines(1)}<span style="--value:${v}%"><b></b></span></div>`).join('')}</div><div class="ui-switch-row">${glyph(icons.spark)}<span></span></div>`,
    status: () => `<div class="ui-status"><div class="ui-status-ring">${glyph(icons.check)}</div><div class="ui-status-pills"><i></i><i></i><i></i><i></i><i></i></div>${lines(2)}</div>`
  };
  // Each lane repeats the exact same geometry. Shared speed and gap keep every
  // card parallel and equally spaced, including across the seamless loop.
  const types = ['history', 'conversation', 'material', 'composer', 'settings', 'status'];
  const sizes = ['tall', 'compact', 'medium', 'short'];
  const grid = scene.querySelector('.cinematic-grid');
  grid.innerHTML = Array.from({ length: 9 }, (_, lane) => {
    const group = sizes.map((size, row) => {
      const type = types[(lane * 2 + row) % types.length];
      return `<div class="orbit-card tile-${size}">${bar}<div class="ui-card-body ui-${type}">${content[type]()}</div></div>`;
    }).join('');
    return `<div class="card-lane"><div class="card-track" style="--phase:${-lane * 5.5}s">${`<div class="tile-group">${group}</div>`.repeat(3)}</div></div>`;
  }).join('');

  let scheduled = false;
  let pointerX = 0;
  let pointerY = 0;
  function render() {
    scheduled = false;
    const box = scene.getBoundingClientRect();
    document.body.classList.toggle('cinematic-opening', box.top > -window.innerHeight * 0.4);
    scene.classList.toggle('scene-in-view', box.bottom > 0 && box.top < window.innerHeight);
    scene.style.setProperty('--pointer-x', reducedMotion.matches ? '0px' : `${pointerX * 12}px`);
    scene.style.setProperty('--pointer-y', reducedMotion.matches ? '0px' : `${pointerY * 9}px`);
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(render); }
  }
  scene.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
    schedule();
  }, { passive: true });
  scene.addEventListener('pointerleave', () => { pointerX = pointerY = 0; schedule(); });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reducedMotion.addEventListener('change', schedule);
  render();
})();

(() => {
  const demo = document.querySelector('.conversation-demo');
  if (!demo) return;
  const messages = [...demo.querySelectorAll('.demo-message')];
  const input = demo.querySelector('.demo-input > span');
  const scroller = demo.querySelector('.conversation-scroll');
  const thinking = demo.querySelector('.demo-thinking');
  const pauseButton = demo.querySelector('.demo-pause');
  const replayButton = demo.querySelector('.demo-replay');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer = null;
  let pending = null;
  let visible = false;
  let paused = false;

  const canPlay = () => visible && !paused && !document.hidden && !motion.matches;
  function cancelTimer() { clearTimeout(timer); timer = null; }
  function schedule(action, delay) {
    cancelTimer();
    pending = action;
    if (!canPlay()) return;
    timer = setTimeout(() => {
      timer = null;
      pending = null;
      action();
    }, delay);
  }
  function scrollToLatest() {
    scroller.scrollTop = scroller.scrollHeight;
  }
  function showReply(userIndex) {
    thinking.classList.remove('is-thinking');
    messages[userIndex + 1].classList.add('is-shown');
    scrollToLatest();
    if (userIndex + 2 < messages.length) schedule(() => typeQuestion(userIndex + 2), 3000);
    else schedule(reset, 5500);
  }
  function sendQuestion(index) {
    input.textContent = '';
    demo.classList.remove('is-typing');
    messages[index].classList.add('is-shown');
    thinking.classList.add('is-thinking');
    scrollToLatest();
    schedule(() => showReply(index), 1250);
  }
  function typeQuestion(index) {
    const text = messages[index].textContent.trim();
    let length = 0;
    demo.classList.add('is-typing');
    function typeNextCharacter() {
      input.textContent = text.slice(0, ++length);
      if (length < text.length) schedule(typeNextCharacter, 85);
      else schedule(() => sendQuestion(index), 650);
    }
    typeNextCharacter();
  }
  function reset() {
    cancelTimer();
    input.textContent = '';
    thinking.classList.remove('is-thinking');
    demo.classList.remove('is-typing');
    messages.forEach(message => message.classList.remove('is-shown'));
    scroller.scrollTop = 0;
    schedule(() => typeQuestion(0), 650);
  }
  function syncPlayback() {
    if (motion.matches) {
      cancelTimer();
      demo.classList.remove('is-animated', 'is-typing');
      thinking.classList.remove('is-thinking');
      input.textContent = '';
      pauseButton.disabled = true;
      replayButton.disabled = true;
      return;
    }
    pauseButton.disabled = false;
    replayButton.disabled = false;
    if (!demo.classList.contains('is-animated')) {
      demo.classList.add('is-animated');
      reset();
    } else if (!canPlay()) cancelTimer();
    else if (!timer && pending) schedule(pending, 200);
  }
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    pauseButton.textContent = paused ? '继续播放' : '暂停动画';
    pauseButton.setAttribute('aria-pressed', String(paused));
    syncPlayback();
  });
  replayButton.addEventListener('click', () => {
    paused = false;
    pauseButton.textContent = '暂停动画';
    pauseButton.setAttribute('aria-pressed', 'false');
    reset();
  });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncPlayback();
  }, { threshold: 0.15 });
  observer.observe(demo);
  document.addEventListener('visibilitychange', syncPlayback);
  motion.addEventListener('change', syncPlayback);
  syncPlayback();
})();
