const TAUSTADE_ARV = 3;

(() => {
  const htmlDom = document.documentElement;

  const idx = Math.floor(Math.random() * TAUSTADE_ARV);

  htmlDom.style.background = `url(../pildid/taust${idx}.jpg) no-repeat center fixed`;
  htmlDom.style.backgroundSize = 'cover';
})();
