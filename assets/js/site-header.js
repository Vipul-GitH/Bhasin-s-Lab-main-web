/*
 * Site header behaviour (mobile menu, dropdowns).
 *
 * The header markup is now written into every page as static HTML (copied
 * from assets/partials/site-header.html) so that search engines and visitors
 * without JavaScript always get the navigation. If a page still contains the
 * old <div data-site-header></div> placeholder, the header is injected as a
 * fallback.
 *
 * This file is the ONLY place that binds the mobile menu toggle. Do not bind
 * it again in main.js: two click handlers on the same button open and then
 * immediately close the menu.
 */
(function () {
  var HEADER_HTML = "<div class=\"top-strip\">\n  <div class=\"container\">\n    <div class=\"group\"><span><i class=\"bi bi-clock\"></i> Open 24x7x365</span><span><i class=\"bi bi-geo-alt\"></i> S-35, Greater Kailash I, New Delhi</span></div>\n    <div class=\"group\"><a class=\"topbar-report-link\" href=\"https://labmate.bhasinpathlabs.com/downloadnew/PatientLogin.aspx\" target=\"_blank\" rel=\"noopener noreferrer\"><i class=\"bi bi-file-earmark-arrow-down\"></i> Download report or receipt</a><a href=\"tel:+919311193111\"><i class=\"bi bi-telephone\"></i> +91 93111 93111</a></div>\n  </div>\n</div>\n<header class=\"header\">\n  <div class=\"container header-inner\">\n    <a href=\"/\" class=\"logo\"><img src=\"/assets/img/dr-bhasins-lab-logo.webp\" alt=\"Dr Bhasin's Lab - Trusted Quality and Service\" width=\"1927\" height=\"652\" decoding=\"async\"></a>\n    <nav class=\"navmenu\" aria-label=\"Primary navigation\"><ul>\n      <li><a href=\"/\">Home</a></li><li><a href=\"/home-collection.html\">Home Collection</a></li><li><a href=\"/24x7-lab.html\">24x7 Lab</a></li>\n      <li class=\"dropdown\"><a href=\"/test-library/\"><span>Tests</span> <i class=\"bi bi-chevron-down\"></i></a><ul><li><a href=\"/test-library/flu-testing/\">Flu Testing</a></li></ul></li>\n      <li><a href=\"/health-checkups/\">Health Checkups</a></li>\n      <li class=\"dropdown\"><a href=\"/cghs-empanelled/\"><span>Government Panels</span> <i class=\"bi bi-chevron-down\"></i></a><ul><li><a href=\"/cghs-empanelled/\">CGHS &amp; CAPF Ayushman</a></li></ul></li>\n    </ul><button class=\"mobile-nav-toggle\" type=\"button\" aria-label=\"Toggle navigation\" aria-expanded=\"false\"><i class=\"bi bi-list\"></i></button></nav>\n    <div class=\"header-actions\"><a class=\"btn-outline btn-sm header-action-icon\" href=\"https://wa.me/919311193111\" target=\"_blank\" rel=\"noopener\" aria-label=\"Chat with the lab on WhatsApp\"><i class=\"bi bi-whatsapp\"></i></a><a class=\"btn-primary btn-sm header-action-icon\" href=\"tel:+919311193111\" aria-label=\"Call Dr Bhasin's Lab\"><i class=\"bi bi-telephone-fill\"></i></a></div>\n  </div>\n</header>\n";

  var mount = document.querySelector('[data-site-header]');
  if (mount) mount.outerHTML = HEADER_HTML;

  if (window.__bhSiteHeaderReady) return;
  window.__bhSiteHeaderReady = true;

  var nav = document.querySelector('.navmenu');
  var toggle = document.querySelector('.mobile-nav-toggle');
  var touchOnly = window.matchMedia('(hover: none)');

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('mobile-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    var icon = toggle.querySelector('i');
    if (icon) icon.className = open ? 'bi bi-x-lg' : 'bi bi-list';
  }

  function closeDropdowns(except) {
    document.querySelectorAll('.navmenu .dropdown.open').forEach(function (item) {
      if (item !== except) item.classList.remove('open');
    });
  }

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('mobile-open'));
    });
  }

  // Parent links ("Tests", "Government Panels") navigate normally. Only on a
  // touch screen wide enough for the desktop menu does the first tap open the
  // dropdown instead, because there is no hover there.
  document.querySelectorAll('.navmenu .dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var item = link.parentElement;
      if (window.innerWidth > 1080 && touchOnly.matches && !item.classList.contains('open')) {
        event.preventDefault();
        closeDropdowns(item);
        item.classList.add('open');
      }
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.navmenu .dropdown')) closeDropdowns();
    if (nav && nav.classList.contains('mobile-open') && !event.target.closest('.navmenu')) setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    closeDropdowns();
    if (nav && nav.classList.contains('mobile-open')) {
      setMenu(false);
      if (toggle) toggle.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080) setMenu(false);
  });
})();
