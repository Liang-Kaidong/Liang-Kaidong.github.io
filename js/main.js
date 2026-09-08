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
  const darkBackground = current?.matches(".hero,.platform-section,.chip-detail,.control-section,.feature-dark,.site-footer");
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

document.querySelectorAll(".mower-page main section:not(.mower-hero) .section-kicker").forEach((label, index) => {
  label.textContent = label.textContent.replace(/^\d+(?=\s*\/)/, String(index + 1).padStart(2, "0"));
});

const footer = document.querySelector(".site-footer");
const footerText = footer?.querySelectorAll("p");
document.querySelectorAll(".footer-links a").forEach((link) => {
  const isGithub = link.href.includes("github.com");
  link.setAttribute("aria-label", isGithub ? "访问 KAYDON 的 GitHub" : "访问 KAYDON 的 CSDN");
  link.title = isGithub ? "GitHub" : "CSDN";
  link.innerHTML = isGithub
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.02c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.75 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.82 1.19 3.08 0 4.42-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.1 6.1A9 9 0 1 0 20.7 16l-3.4-1.7A5.2 5.2 0 1 1 16.5 9l2.6-2.9Z"/></svg>';
});
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
  footerText[footerText.length - 1].textContent = `© ${parts.year} KAYDON. ALL RIGHTS RESERVED.`;
}

updateFooterClock();
setInterval(updateFooterClock, 1000);
window.addEventListener("scroll", updateHeaderTheme, { passive: true });
window.addEventListener("scroll", () => {
  if (window.matchMedia("(max-width: 820px)").matches && header.classList.contains("menu-open")) {
    closeNavigation();
  }
}, { passive: true });
window.addEventListener("resize", updateHeaderTheme);
updateHeaderTheme();
