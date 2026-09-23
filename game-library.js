// Bundled games run without an upload service or a stored upload token.
const bundledGames = [
  {id:1001,name:'HTML5 桌球 / Pool',category:'sports',subtitle:'鼠标瞄准，按住蓄力、松开击球 · Mouse controls',visual:'visual-sport',featured:true,published:true,url:'/games/pool/'},
  {id:1002,name:'街头霸王 / Street Fighter',category:'action',subtitle:'键盘格斗 · Desktop keyboard required',visual:'visual-racer',featured:true,published:true,url:'/games/street-fighter/'}
];
games = [...bundledGames, ...games.filter(g => !bundledGames.some(b => b.id === g.id))];
const originalOpenGame = openGame;
const coverNames = {1001:'pool',1002:'street-fighter',1:'stellar-drift',2:'rush-hour',3:'shape-shift',4:'goal-rush',5:'neon-runner',6:'orbit-bloom'};
const originalRenderGames = renderGames;
renderGames = function() {
  originalRenderGames();
  document.querySelectorAll('#gameGrid [data-play]').forEach(button => {
    const game = games.find(g => String(g.id) === button.dataset.play);
    if (!game) return;
    const image = document.createElement('img');
    image.src = '/games/covers/' + (coverNames[game.id] || 'default') + '.webp';
    image.alt = game.name + (lang === 'zh' ? ' 宣传图' : ' cover');
    image.width = 800; image.height = 450;
    image.loading = 'lazy'; image.decoding = 'async';
    image.className = 'game-cover';
    image.onerror = () => { image.onerror=null; image.src='/games/covers/default.webp'; };
    button.querySelector('.card-visual').replaceWith(image);
    if (!game.url) {
      const badge = document.createElement('span');
      badge.className = 'demo-label';
      badge.textContent = lang === 'zh' ? '演示' : 'DEMO';
      button.append(badge);
    }
  });
};
openGame = function(game) {
  if (!game.url) return originalOpenGame(game);
  close();
  const canvas = $('#gameCanvas');
  canvas.style.display = 'none';
  const frame = document.createElement('iframe');
  frame.title = game.name;
  frame.src = game.url;
  frame.setAttribute('sandbox', 'allow-scripts allow-pointer-lock');
  frame.setAttribute('allow', 'fullscreen; autoplay');
  frame.style.cssText = 'width:100%;height: min(70vh,650px);border:0;background:#080e18;display:block';
  canvas.after(frame);
  $('#modalGameTitle').textContent = game.name;
  $('#modalGameCategory').textContent = category(game.category);
  const help = $('.game-help');
  const oldHelp = help.textContent;
  help.textContent = game.subtitle;
  $('#gameOverlay').classList.add('open');
  $('#gameOverlay').setAttribute('aria-hidden','false');
  $('#gameFullscreen').onclick = () => frame.requestFullscreen?.();
  cleanup = () => {
    frame.remove(); canvas.style.display = ''; help.textContent = oldHelp;
    $('#gameFullscreen').onclick = () => canvas.requestFullscreen?.();
    cleanup = null;
  };
};
document.addEventListener('DOMContentLoaded', () => {
  $('.hero-meta strong').textContent = games.filter(g=>g.published).length;
  $('.featured-chip strong').textContent = bundledGames[0].name;
  const style = document.createElement('style');
  style.textContent = `
    .game-card-image{width:100%;height:auto;aspect-ratio:16/10;border-radius:12px;padding:18px;text-align:left}
    .game-cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform .4s ease}
    .game-card:hover .game-cover{transform:scale(1.06)}
    .game-card-image:after{background:linear-gradient(180deg,rgba(3,8,18,.12),transparent 30%,rgba(3,8,18,.3) 55%,rgba(3,8,18,.95))}
    .game-card-image .card-title{font-size:20px;line-height:1.3;text-shadow:0 2px 9px #000}
    .demo-label{position:absolute;top:10px;right:10px;border:1px solid #ffffff40;background:#07101bbf;color:#ddd;padding:4px 7px;border-radius:4px;font-size:10px}
    #editorModal{z-index:50}.mini-art{position:relative;overflow:hidden}
    @media(prefers-reduced-motion:reduce){.game-cover{transition:none}}
  `;
  document.head.append(style);
});
