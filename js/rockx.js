(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const teaser = document.querySelector('#rxTeaser');
  const pause = document.querySelector('#rxPause');
  let userPaused = reduced.matches;
  function syncPause(){pause.textContent=teaser.paused?'播放动态画面':'暂停动态画面';pause.setAttribute('aria-pressed',String(teaser.paused));}
  teaser.addEventListener('play',syncPause);teaser.addEventListener('pause',syncPause);
  pause.addEventListener('click',()=>{userPaused=!teaser.paused;if(userPaused)teaser.pause();else teaser.play().catch(()=>{});});
  if(reduced.matches)teaser.pause();
  new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)teaser.pause();else if(!userPaused&&!reduced.matches)teaser.play().catch(()=>{});});},{threshold:.1}).observe(teaser);
  const dialog=document.querySelector('#rxFilm');
  const film=document.querySelector('#rxFullFilm');
  document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{dialog.showModal();document.body.style.overflow='hidden';teaser.pause();if(!film.src)film.src='assets/rockx/film.mp4';film.play().catch(()=>{});}));
  function closeFilm(){dialog.close();}
  document.querySelector('#rxCloseFilm').addEventListener('click',closeFilm);
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeFilm();}});
  dialog.addEventListener('close',()=>{film.pause();document.body.style.overflow='';if(!userPaused&&!reduced.matches)teaser.play().catch(()=>{});});
  const infoBoxes=[...document.querySelectorAll('details.rx-info')];
  infoBoxes.forEach(box=>box.querySelector('summary').addEventListener('click',event=>{
    event.preventDefault();const opening=!box.open;
    infoBoxes.forEach(other=>other.open=false);box.open=opening;
  }));
  document.addEventListener('click',event=>{
    const box=event.target.closest('details.rx-info');
    infoBoxes.forEach(other=>{if(other!==box)other.open=false;});
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')infoBoxes.forEach(box=>box.open=false);
  });
  const tabs=[...document.querySelectorAll('[data-system]')];
  function selectTab(button){tabs.forEach(t=>{const on=t===button;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on;});}
  tabs.forEach((button,i)=>{button.addEventListener('click',()=>selectTab(button));button.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let k=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectTab(tabs[k]);tabs[k].focus();});});
  const portData={
    right:{image:'ports',alt:'右侧接口特写：四个 USB-A 与一个 RJ45 网口',items:[['USB 3.0','1 × USB-A','连接兼容的外接存储，硬盘与硬盘盒另配。',37,57],['USB 2.0','3 × USB-A','连接键盘、鼠标等兼容外设。',50,42],['千兆以太网','1 × RJ45','连接路由器或交换机，访问局域网中的 NAS。',65,48]]},
    front:{image:'glass',alt:'正面屏幕与前面板特写',items:[['前置屏幕','正面独立窗口','位于前面板下方，产品展示保持息屏。',50,52],['前面板','分体装配','独立前面板，分体装配。',52,16],['固定螺丝','四角装配','前面板四角螺丝固定。',18,82]]},
    rear:{image:'rear',alt:'后侧内凹电源接口设计示意',items:[['电源开口','背部接口区域','内凹电源开口。插座定义以实际接线为准。',51,47],['后面板','完整机身轮廓','接口内凹安装，无外露排线。',37,30],['固定结构','接口安装位置','独立螺丝固定接口面板。',59,47]]}
  };
  let currentView='right';
  function selectPort(i){const d=portData[currentView].items[i];document.querySelector('#portDetail').textContent=d[2];document.querySelectorAll('[data-port]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.port)===i)));}
  function setView(key){currentView=key;const d=portData[key],img=document.querySelector('#portImage');img.src=`assets/rockx/${d.image}.webp`;img.alt=d.alt;document.querySelectorAll('[data-port-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.portView===key)));document.querySelector('#portChoices').innerHTML=d.items.map((p,i)=>`<button class="rx-port-choice" data-port="${i}" aria-pressed="${i===0}"><span>0${i+1}</span><span><strong>${p[0]}</strong><small>${p[1]}</small></span></button>`).join('');document.querySelector('#portHotspots').innerHTML=d.items.map((p,i)=>`<button class="rx-hotspot" style="left:${p[3]}%;top:${p[4]}%" data-port="${i}" aria-label="${p[0]}" aria-pressed="${i===0}">${i+1}</button>`).join('');document.querySelectorAll('[data-port]').forEach(b=>b.addEventListener('click',()=>selectPort(Number(b.dataset.port))));selectPort(0);}
  document.querySelectorAll('[data-port-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.portView)));setView('right');
})();
