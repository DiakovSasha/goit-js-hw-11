let calcScrollValue = () => {
  let scrollUpParent = document.querySelector('.scroll__up');
  let scrollUpValue = document.querySelector('.scroll__up--value');
  let pos = document.documentElement.scrollTop;

  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrollValue = Math.round((pos * 100) / calcHeight);
  if (pos > 100) {
    scrollUpParent.style.opacity = '1';
  } else {
    scrollUpParent.style.opacity = '0';
  }
  scrollUpParent.addEventListener('click', () => {
    document.documentElement.scrollTop = 0;
  });
  scrollUpParent.style.background = `conic-gradient(#add8e6 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};
window.onscroll = calcScrollValue;
window.onload = calcScrollValue;
