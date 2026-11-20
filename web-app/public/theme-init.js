// Runs before first paint (loaded as a blocking script from index.html) so
// there is no theme flash. External file rather than inline so the CSP can
// stay script-src 'self' with no hashes to keep in sync.
// Resolve theme + dialect before first paint so there is no flash.
(function () {
  try {
    var s = JSON.parse(localStorage.getItem('appSettings') || '{}');
    var d = s.currentDialect === 'Levantine' ? 'levantine' : 'egyptian';
    document.documentElement.setAttribute('data-dialect', d);
    var t = s.theme || 'system';
    var dark =
      t === 'dark' ||
      (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {
    document.documentElement.setAttribute('data-dialect', 'egyptian');
  }
})();
