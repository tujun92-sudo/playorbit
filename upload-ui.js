document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('#newGame');
  if (!trigger || document.querySelector('#uploadGameSource')) return;
  const link = document.createElement('a');
  link.id = 'uploadGameSource';
  link.className = 'button secondary full';
  link.href = '/upload.html';
  link.innerHTML = '<i data-lucide="upload-cloud"></i><span>Upload H5 ZIP</span>';
  trigger.insertAdjacentElement('afterend', link);
  if (window.lucide) lucide.createIcons();
});
