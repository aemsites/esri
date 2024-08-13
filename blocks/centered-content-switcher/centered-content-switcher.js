import { createOptimizedPicture } from '../../scripts/aem.js';
import { calciteButton } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  block.classList.add('calcite-mode-dark');
  document.querySelector('.centered-content-switcher-container').classList.add('calcite-mode-dark');

  block.querySelectorAll('img').forEach((img) => img
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));

  let selectedIdx = 0;
  [...block.children].forEach((child) => {
    child.setAttribute('aria-hidden', 'true');
    child.setAttribute('role', 'tabpanel');

    // child.addEventListener('click', () => {
    //   block.children[selectedIdx].setAttribute('aria-hidden', 'true');
    //   selectedIdx = [...block.children].indexOf(child);
    //   block.children[selectedIdx].setAttribute('aria-hidden', 'false');
    // });

    const imgUrl = child.children[1].querySelector('a').href;
    child.removeChild(child.children[1]);

    child.setAttribute('style', `background-image: url(${imgUrl})`);

    const anchor = child.querySelector('a');
    const playButton = calciteButton({
      'icon-start': 'play-f',
      appearance: 'solid',
      kind: 'inverse',
      scale: 'l',
      round: '',
      href: anchor.href,
    });
    anchor.parentElement.appendChild(playButton);
    anchor.parentElement.removeChild(anchor);
  });
  block.children[selectedIdx].setAttribute('aria-hidden', 'false');
}
