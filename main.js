(function () {
  var toggle = document.getElementById("sidebar-toggle");
  var sidebar = document.getElementById("site-sidebar");
  var scrim = document.getElementById("sidebar-scrim");
  var nav = document.getElementById("site-nav");
  var year = document.getElementById("year");
  var progress = document.getElementById("scroll-progress");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (progress) {
    function onScroll() {
      var el = document.documentElement;
      var sh = el.scrollHeight - el.clientHeight;
      var pct = sh > 0 ? (el.scrollTop / sh) * 100 : 0;
      progress.style.width = pct + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reveals = document.querySelectorAll(".js-reveal");

  function setRevealsVisible() {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function revealInOrNearViewport() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var margin = 100;
    reveals.forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh + margin && r.bottom > -margin) {
        el.classList.add("is-visible");
      }
    });
  }

  if (!reduceMotion.matches && "IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "80px 0px 120px 0px",
        threshold: 0,
      }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
    requestAnimationFrame(revealInOrNearViewport);
    window.addEventListener("load", revealInOrNearViewport);
    setTimeout(revealInOrNearViewport, 50);
  } else {
    setRevealsVisible();
  }

  function setDrawerOpen(open) {
    if (!sidebar || !toggle) return;
    sidebar.classList.toggle("is-open", open);
    document.body.classList.toggle("sidebar-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu"
    );
    if (scrim) {
      scrim.hidden = !open;
    }
  }

  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      setDrawerOpen(!sidebar.classList.contains("is-open"));
    });
  }

  if (scrim) {
    scrim.addEventListener("click", function () {
      setDrawerOpen(false);
    });
  }

  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setDrawerOpen(false);
      });
    });
  }

  window.addEventListener(
    "resize",
    function () {
      if (window.matchMedia("(min-width: 53rem)").matches) {
        setDrawerOpen(false);
      }
    },
    { passive: true }
  );
})();
