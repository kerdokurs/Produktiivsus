const TAUSTADE_ARV = 5;

(() => {
  const htmlDom = document.documentElement;

  const idx = Math.floor(Math.random() * TAUSTADE_ARV);

  htmlDom.style.background = `url(https://kodu.ut.ee/~kerdo/produktiivsus/pildid/taust${idx}.jpg) no-repeat center fixed`;
  htmlDom.style.backgroundSize = 'cover';
})();
