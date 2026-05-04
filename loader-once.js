/**
 * loader-once.js — METTEC
 * ─────────────────────────────────────────────────────────────────
 * Le loader s'affiche UNE SEULE FOIS par session de navigation.
 * Il est ignoré si :
 *   • l'utilisateur a déjà vu le loader dans cet onglet
 *   • on vient d'une autre page du même site (navigation interne)
 *
 * Usage : remplacer le <script> loader inline par :
 *   <script src="loader-once.js"></script>
 * ─────────────────────────────────────────────────────────────────
 */

(function () {
  var STORAGE_KEY = 'mettec_loader_shown';
  var MIN_DURATION = 1200; // ms — durée minimale d'affichage
  var loader = document.getElementById('pageLoader');

  if (!loader) return; // pas de loader dans la page, rien à faire

  /* ── 1. Vérifier si le loader a déjà été affiché ── */
  var alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';

  if (alreadySeen) {
    /* Masquer instantanément sans animation pour ne pas bloquer */
    loader.style.display = 'none';
    return;
  }

  /* ── 2. Première visite de la session : afficher le loader ── */
  sessionStorage.setItem(STORAGE_KEY, '1');

  /* Animer la barre de progression */
  var bar = loader.querySelector('.progress-bar');
  var progress = 0;

  if (bar) {
    var interval = setInterval(function () {
      progress = Math.min(progress + Math.random() * 18, 90);
      bar.style.width = progress + '%';
      if (progress >= 90) clearInterval(interval);
    }, 120);
  }

  /* ── 3. Masquer le loader une fois la page chargée ── */
  var start = Date.now();

  function hideLoader() {
    var elapsed = Date.now() - start;
    var delay   = Math.max(0, MIN_DURATION - elapsed);

    setTimeout(function () {
      if (bar) bar.style.width = '100%';

      setTimeout(function () {
        loader.classList.add('hide');
        loader.addEventListener('transitionend', function () {
          loader.style.display = 'none';
        }, { once: true });

        /* Sécurité : forcer le masquage si transitionend ne se déclenche pas */
        setTimeout(function () {
          loader.style.display = 'none';
        }, 800);
      }, 200);
    }, delay);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    /* Fallback : masquer après 5 s dans tous les cas */
    setTimeout(hideLoader, 5000);
  }

  /* ── 4. Optionnel : réinitialiser si l'utilisateur force le refresh (Ctrl+Shift+R) ── */
  /* Le sessionStorage est automatiquement vidé à la fermeture de l'onglet,
     mais pas sur un simple F5. Pour forcer le re-affichage sur hard-refresh,
     décommenter les lignes ci-dessous : */

  // window.addEventListener('beforeunload', function () {
  //   if (performance && performance.getEntriesByType) {
  //     var nav = performance.getEntriesByType('navigation')[0];
  //     if (nav && nav.type === 'reload') {
  //       sessionStorage.removeItem(STORAGE_KEY);
  //     }
  //   }
  // });
})();
