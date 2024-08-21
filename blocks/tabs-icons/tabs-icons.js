import { div, a } from '../../scripts/dom-helpers.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  block.classList.add('calcite-mode-dark');
  document.querySelector('.tabs-container').classList.add('calcite-mode-dark');
  document.querySelector('.tabs-container').classList.remove('calcite-mode-light');


  block.querySelectorAll('img').forEach((img) => img
    .closest('picture')?.replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));
}
