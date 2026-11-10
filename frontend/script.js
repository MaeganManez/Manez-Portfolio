(function () {
  "use strict";

  // Add future certificates here. Place the PDF in the certificates folder.
  var certificates = [
    { title: "HTML Essentials", file: "certificates/HTMLEssentialsv1.pdf", png: "certificates/HTMLEssentialsv1-1.png" },
    { title: "CSS Essentials", file: "certificates/CSSEssentialsv1.pdf", png: "certificates/CSSEssentialsv1-1.png" },
    { title: "Python Essentials 1", file: "certificates/PythonEssentials1.pdf", png: "certificates/PythonEssentials1-1.png" },
    { title: "Python Essentials 2", file: "certificates/PythonEssentials2.pdf", png: "certificates/PythonEssentials2-1.png" },
    { title: "Fortinet Certificate", file: "certificates/FortinetCert.pdf", png: "certificates/FortinetCert-1.png" }
  ];

  var awardIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></svg>';

  var grid = document.getElementById("certGrid");
  (grid ? certificates : []).forEach(function (c) {
    var el = document.createElement("article");
    el.className = "card cert";
    el.innerHTML = '<div class="c-icon">' + awardIcon + '</div><p class="cert-label">Certification</p><h3></h3><button type="button" class="btn solid">View Certificate</button>';
    el.querySelector("h3").textContent = c.title;
    var b = el.querySelector("button");
    b.setAttribute("aria-label", "View " + c.title);
    b.addEventListener("click", function () { openModal(c, b); });
    grid.appendChild(el);
  });

  // Theme
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  function syncLabel() {
    var dark = root.getAttribute("data-theme") === "dark";
    toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  syncLabel();
  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncLabel();
  });

  // Mobile menu
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); burger.focus(); }
  });

  // Active nav link
  var links = menu.querySelectorAll("a");
  var sections = document.querySelectorAll("main section[id]");
  function setActive() {
    if (document.body.hasAttribute("data-static-nav")) return;
    var pos = window.scrollY + 120, current = "home";
    sections.forEach(function (s) { if (s.offsetTop <= pos) current = s.id; });
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) current = "contact";
    links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + current); });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  // Reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (i) { io.observe(i); });
  } else {
    items.forEach(function (i) { i.classList.add("in"); });
  }

  // Certificate modal
  var modal = document.getElementById("certModal");
  var lastFocus = null;
  var mImg, mZoom;
  function setZoom(on) {
    mImg.classList.toggle("zoomed", on);
    mZoom.setAttribute("aria-pressed", String(on));
    mZoom.textContent = on ? "Zoom out" : "Zoom in";
  }
  function openModal(c, trigger) {
    lastFocus = trigger;
    document.getElementById("certTitle").textContent = c.title;
    mImg.alt = c.title + " certificate";
    mImg.src = c.png;
    setZoom(false);
    document.getElementById("certOpen").href = c.file;
    document.getElementById("certDownload").href = c.file;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("certClose").focus();
  }
  function closeModal() {
    modal.hidden = true;
    mImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  if (modal) {
    mImg = document.getElementById("certImg");
    mZoom = document.getElementById("certZoom");
    mZoom.addEventListener("click", function () { setZoom(!mImg.classList.contains("zoomed")); });
    mImg.addEventListener("click", function () { setZoom(!mImg.classList.contains("zoomed")); });
    document.getElementById("certClose").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key === "Tab") {
        var f = modal.querySelectorAll('a[href], button, [tabindex="0"]');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
