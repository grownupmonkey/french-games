/* ===== Jetons: shared reward hook for "Le grand voyage" (index.html) =====
   Every game page calls GVJetons.award(gameId, ratio) when a student finishes.
   ratio is 0–1 (score). Reward: 2–5 jetons by score, +5 the first time a game is finished.
   Saved in localStorage key 'gv.v1', which the picker page reads (same site = same storage). */
window.GVJetons = (function () {
  var KEY = 'gv.v1', BASE = 2, RANGE = 3, FIRST = 5, last = 0;
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function home() { return location.pathname.replace(/\/(10|20)-3y\/[^\/]*$/, '/') || '../'; }
  function badge(n, first) {
    var d = document.createElement('div');
    d.setAttribute('role', 'status');
    d.style.cssText = 'position:fixed;left:50%;bottom:22px;z-index:99999;transform:translate(-50%,140%);transition:transform .6s cubic-bezier(.2,1.4,.4,1);' +
      'display:flex;align-items:center;gap:12px;padding:10px 12px 10px 14px;border-radius:999px;background:#1F2A44;color:#FBF3E4;' +
      'box-shadow:0 10px 30px rgba(20,28,48,.35),0 0 0 3px #F2C14E;font:700 16px/1.2 "Baloo 2","Atkinson Hyperlegible",system-ui,sans-serif;';
    d.innerHTML = '<span style="display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#F2C14E;color:#1F2A44;font-size:18px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.18)">★</span>' +
      '<span>+' + n + ' jetons' + (first ? ' <small style="opacity:.8;font-weight:600">(dont +' + FIRST + ' première fois)</small>' : '') + '</span>' +
      '<a href="' + home() + '" style="margin-left:4px;padding:7px 14px;border-radius:999px;background:#E88B9C;color:#1F2A44;text-decoration:none;font-weight:800">Boîte mystère →</a>' +
      '<button aria-label="Fermer" style="border:0;background:none;color:#FBF3E4;font-size:20px;cursor:pointer;padding:0 4px">×</button>';
    d.querySelector('button').onclick = function () { d.style.transform = 'translate(-50%,160%)'; setTimeout(function () { d.remove(); }, 600); };
    document.body.appendChild(d);
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.style.transform = 'translate(-50%,0)'; }); });
  }
  function award(gameId, ratio) {
    var now = Date.now();
    if (now - last < 8000) return 0;          // ignore a double call from the same finish
    last = now;
    ratio = Math.max(0, Math.min(1, +ratio || 0));
    var s = load(), played = s.played || {}, g = played[gameId] || { n: 0, best: 0 };
    var first = g.n === 0, n = BASE + Math.round(RANGE * ratio) + (first ? FIRST : 0);
    g.n += 1; g.best = Math.max(g.best, ratio); played[gameId] = g;
    s.played = played; s.tokens = (s.tokens || 0) + n;
    s.gain = { n: n, game: gameId, at: now };   // the picker shows this when the student returns
    save(s);
    try { badge(n, first); } catch (e) {}
    return n;
  }
  return { award: award };
})();
