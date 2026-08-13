(function () {
  var KEY = 'idarose_unlocked';
  var PASS = 'Empre$$Gin';
  if (sessionStorage.getItem(KEY) === '1') return;

  var style = document.createElement('style');
  style.textContent = [
    '#_site_gate{position:fixed;inset:0;background:#0a0a0a;z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;font-family:"Courier New",monospace;}',
    '#_site_gate .g-logo{font-size:.7rem;letter-spacing:.2em;color:#c9a96e;text-transform:uppercase;margin-bottom:2rem;}',
    '#_site_gate .g-title{font-family:Georgia,serif;font-size:clamp(1.4rem,4vw,2rem);font-weight:normal;color:#f0f0f0;margin-bottom:.4rem;text-align:center;}',
    '#_site_gate .g-sub{font-size:.72rem;color:#888;letter-spacing:.1em;margin-bottom:2.5rem;text-align:center;}',
    '#_site_gate form{display:flex;flex-direction:column;gap:.75rem;width:100%;max-width:280px;}',
    '#_site_gate input{background:#111;border:1px solid #222;color:#f0f0f0;font-family:"Courier New",monospace;font-size:.9rem;padding:.85rem 1rem;letter-spacing:.04em;outline:none;transition:border-color .2s;}',
    '#_site_gate input:focus{border-color:#c9a96e;}',
    '#_site_gate input.err{border-color:#c04040;}',
    '#_site_gate button{background:transparent;border:1px solid #c9a96e;color:#c9a96e;font-family:"Courier New",monospace;font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;padding:.85rem;cursor:pointer;transition:background .2s,color .2s;}',
    '#_site_gate button:hover{background:#c9a96e;color:#0a0a0a;}',
    '#_site_gate .g-err{font-size:.68rem;color:#c04040;letter-spacing:.05em;text-align:center;min-height:1rem;}',
    '#_site_gate .g-pw-wrap{position:relative;display:flex;}',
    '#_site_gate .g-pw-wrap input{flex:1;padding-right:2.8rem;}',
    '#_site_gate .g-show{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#666;cursor:pointer;font-size:.78rem;letter-spacing:.05em;text-transform:uppercase;padding:0;transition:color .2s;}',
    '#_site_gate .g-show:hover{background:none;color:#c9a96e;}'
  ].join('');
  document.head.appendChild(style);

  var gate = document.createElement('div');
  gate.id = '_site_gate';
  gate.innerHTML = [
    '<div class="g-logo">The Ida Rose Farhat Collection</div>',
    '<h1 class="g-title">Private Access</h1>',
    '<p class="g-sub">Enter password to continue</p>',
    '<form id="_g_form">',
      '<div class="g-pw-wrap">',
        '<input type="password" id="_g_pw" placeholder="Password" autocomplete="off" />',
        '<button type="button" class="g-show" id="_g_show" onclick="(function(){var i=document.getElementById(\'_g_pw\'),s=document.getElementById(\'_g_show\');i.type=i.type===\'password\'?\'text\':\'password\';s.textContent=i.type===\'password\'?\'Show\':\'Hide\'})()">Show</button>',
      '</div>',
      '<button type="submit">Enter &rarr;</button>',
      '<p class="g-err" id="_g_err"></p>',
    '</form>'
  ].join('');

  document.addEventListener('DOMContentLoaded', function () {
    document.body.prepend(gate);
  });
  if (document.body) document.body.prepend(gate);

  document.addEventListener('submit', function (e) {
    if (e.target.id !== '_g_form') return;
    e.preventDefault();
    var input = document.getElementById('_g_pw');
    if (input.value === PASS) {
      sessionStorage.setItem(KEY, '1');
      document.getElementById('_site_gate').remove();
    } else {
      input.classList.add('err');
      document.getElementById('_g_err').textContent = 'Incorrect password.';
      input.value = '';
      setTimeout(function () { input.classList.remove('err'); }, 1500);
    }
  }, true);
})();
