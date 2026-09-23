// Bundled games run without an upload service or a stored upload token.
const bundledGames = [
  {id:1001,name:'HTML5 桌球 / Pool',category:'sports',subtitle:'鼠标瞄准，按住蓄力、松开击球 · Mouse controls',visual:'visual-sport',featured:true,published:true,url:'/games/pool/'},
  {id:1002,name:'街头霸王 / Street Fighter',category:'action',subtitle:'键盘格斗 · Desktop keyboard required',visual:'visual-racer',featured:true,published:true,url:'/games/street-fighter/'}
];
games = [...bundledGames, ...games.filter(g => !bundledGames.some(b => b.id === g.id))];
const originalOpenGame = openGame;
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
  style.textContent = '.game-card-image{width:100%}#editorModal{z-index:50}.mini-art{position:relative;overflow:hidden}';
  document.head.append(style);
});
