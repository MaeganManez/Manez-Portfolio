(function () {
  "use strict";

  // Add future certificates here. Place the PDF in the certificates folder.
  var certificates = [
    { title: "HTML Essentials", file: "certificates/HTMLEssentialsv1.pdf" },
    { title: "CSS Essentials", file: "certificates/CSSEssentialsv1.pdf" },
    { title: "Python Essentials 1", file: "certificates/PythonEssentials1.pdf" },
    { title: "Python Essentials 2", file: "certificates/PythonEssentials2.pdf" },
    { title: "Fortinet Certificate", file: "certificates/FortinetCert.pdf" }
  ];

  var docIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>';

  var grid = document.getElementById("certGrid");
  (grid ? certificates : []).forEach(function (c) {
    var el = document.createElement("article");
    el.className = "card cert";
    el.innerHTML =
      '<div class="c-icon">' + docIcon + "</div><h3></h3>" +
      '<button type="button" class="btn ghost">View Certificate</button>';
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
  function openModal(c, trigger) {
    lastFocus = trigger;
    document.getElementById("certTitle").textContent = c.title;
    document.getElementById("certObj").setAttribute("data", c.file);
    document.getElementById("certOpen").href = c.file;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("certClose").focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.getElementById("certObj").setAttribute("data", "");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  if (modal) {
    document.getElementById("certClose").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key === "Tab") {
        var f = modal.querySelectorAll("a[href], button");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
