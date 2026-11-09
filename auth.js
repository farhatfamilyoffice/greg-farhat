(function () {
  var KEY = 'farhat_auth_v1';
  if (sessionStorage.getItem(KEY) === 'ok') return;

  var HASH = '7da410baf495f341150a9f8ab21d1de7644a06d6bda7a2750b7994831093ed17';

  document.documentElement.style.overflow = 'hidden';

  var overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.innerHTML = [
    '<style>',
    '#auth-overlay{position:fixed;inset:0;z-index:99999;background:#1a1714;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;}',
    '#auth-box{background:#242220;border:1px solid #3a3530;border-radius:4px;padding:2.5rem 2rem;width:100%;max-width:360px;text-align:center;}',
    '#auth-box h2{color:#c9a96e;font-size:1rem;letter-spacing:0.15em;text-transform:uppercase;font-family:"Courier New",monospace;margin:0 0 0.4rem;}',
    '#auth-box p{color:#8a8278;font-size:0.85rem;margin:0 0 1.75rem;}',
    '#auth-pwd{width:100%;box-sizing:border-box;background:#111;border:1px solid #3a3530;border-radius:3px;color:#f3ede0;font-size:1rem;padding:0.65rem 0.9rem;outline:none;transition:border-color 0.2s;}',
    '#auth-pwd:focus{border-color:#9a7440;}',
    '#auth-submit{margin-top:0.9rem;width:100%;background:#9a7440;color:#1a1714;font-family:"Courier New",monospace;font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;border:none;border-radius:3px;padding:0.7rem;cursor:pointer;font-weight:700;transition:background 0.2s;}',
    '#auth-submit:hover{background:#c9a96e;}',
    '#auth-err{color:#c0735a;font-size:0.8rem;margin-top:0.75rem;min-height:1.1em;}',
    '</style>',
    '<div id="auth-box">',
    '<h2>Farhat Family</h2>',
    '<p>This section is private. Enter the family password to continue.</p>',
    '<input id="auth-pwd" type="password" placeholder="Password" autocomplete="current-password" />',
    '<button id="auth-submit">Enter</button>',
    '<div id="auth-err"></div>',
    '</div>'
  ].join('');

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(overlay);
    document.getElementById('auth-pwd').focus();
  });

  if (document.readyState !== 'loading') {
    document.body.appendChild(overlay);
    setTimeout(function () { document.getElementById('auth-pwd').focus(); }, 50);
  }

  function attempt() {
    var pwd = document.getElementById('auth-pwd').value;
    var err = document.getElementById('auth-err');
    err.textContent = '';
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd)).then(function (buf) {
      var hex = Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      if (hex === HASH) {
        sessionStorage.setItem(KEY, 'ok');
        document.documentElement.style.overflow = '';
        overlay.remove();
      } else {
        err.textContent = 'Incorrect password.';
        document.getElementById('auth-pwd').value = '';
        document.getElementById('auth-pwd').focus();
      }
    });
  }

  document.addEventListener('click', function (e) { if (e.target.id === 'auth-submit') attempt(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && document.getElementById('auth-pwd')) attempt(); });
})();
