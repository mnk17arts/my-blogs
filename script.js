const menuButton = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
if (menuButton && sidebar) {
  menuButton.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}
