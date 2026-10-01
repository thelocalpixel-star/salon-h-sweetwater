// Salon H — interactions
(function () {
  "use strict";

  /* Sticky nav */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Review slider */
  var track = document.getElementById("reviewTrack");
  var dotsWrap = document.getElementById("sliderDots");
  var cards = track ? track.children.length : 0;
  var idx = 0, timer = null;

  if (track && cards > 1) {
    for (var i = 0; i < cards; i++) {
      (function (n) {
        var d = document.createElement("button");
        d.setAttribute("role", "tab");
        d.setAttribute("aria-label", "Show review " + (n + 1));
        d.addEventListener("click", function () { go(n); restart(); });
        dotsWrap.appendChild(d);
      })(i);
    }
    var dots = dotsWrap.children;
    function go(n) {
      idx = (n + cards) % cards;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle("active", j === idx);
      }
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 6000);
    }
    // pause on touch / hover
    var slider = document.getElementById("reviewSlider");
    slider.addEventListener("pointerdown", function () { if (timer) clearInterval(timer); }, { passive: true });
    slider.addEventListener("pointerup", restart, { passive: true });
    go(0);
    restart();
  }

  /* Lightbox */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lastFocus = null;

  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll(".g-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var img = btn.querySelector("img");
      openLightbox(btn.getAttribute("data-full"), img ? img.alt : "");
    });
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
})();
