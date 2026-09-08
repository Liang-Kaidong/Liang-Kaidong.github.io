const header = document.querySelector("#siteHeader");
const hero = document.querySelector(".hero");
const menuButton = document.querySelector(".menu-toggle");
const projectNav = document.querySelector(".nav-project");
const projectTrigger = document.querySelector(".project-trigger");

function closeNavigation() {
  header.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
  projectNav?.classList.remove("open");
  projectTrigger?.setAttribute("aria-expanded", "false");
}

function updateHeaderTheme() {
  const overVideo = Boolean(hero && window.scrollY < hero.offsetHeight - header.offsetHeight);
  const probeY = header.offsetHeight / 2;
  const sections = [...document.querySelectorAll("main > section, footer")];
  const current = sections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= probeY && rect.bottom > probeY;
  });
  const darkBackground = current?.matches(".hero,.platform-section,.chip-detail,.feature-dark,.site-footer");
  const onLight = !overVideo && !darkBackground;
  header.classList.toggle("over-video", overVideo);
  header.classList.toggle("on-light", onLight);
}

menuButton?.addEventListener("click", () => {
  const open = header.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

projectTrigger?.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = projectNav.classList.toggle("open");
  projectTrigger.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (event) => {
  if (header && !header.contains(event.target)) {
    closeNavigation();
  } else if (projectNav && !projectNav.contains(event.target)) {
    projectNav.classList.remove("open");
    projectTrigger?.setAttribute("aria-expanded", "false");
  }
});

header?.addEventListener("mouseleave", () => {
  projectNav?.classList.remove("open");
  projectTrigger?.setAttribute("aria-expanded", "false");
  if (window.matchMedia("(max-width: 820px)").matches) closeNavigation();
});

document.querySelectorAll(".nav-link:not(.project-trigger)").forEach((link) => link.addEventListener("click", () => {
  closeNavigation();
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal-section").forEach((section) => revealObserver.observe(section));

const footer = document.querySelector(".site-footer");
const footerText = footer?.querySelectorAll("p");
const clockFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
  hour12: false
});

function updateFooterClock() {
  if (!footerText?.length) return;
  const parts = Object.fromEntries(clockFormatter.formatToParts(new Date()).map(({ type, value }) => [type, value]));
  footerText[0].textContent = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
  footerText[footerText.length - 1].textContent = "© 2026 KAYDON · 个人网页";
}

updateFooterClock();
setInterval(updateFooterClock, 1000);
window.addEventListener("scroll", updateHeaderTheme, { passive: true });
window.addEventListener("resize", updateHeaderTheme);
updateHeaderTheme();
