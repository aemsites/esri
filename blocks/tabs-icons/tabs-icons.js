import { createOptimizedPicture } from '../../scripts/aem.js';
import { div } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  block.querySelectorAll('img').forEach((img) => img
    .closest('picture')?.replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));

  const content = block.children[0].children[0];
  const textDiv = div({ class: 'text-div calcite-animate calcite-animate__in-up' }, ...[...content.children].slice(0, 3));
  content.children[0].classList.add('calcite-animate', 'calcite-animate__in-up');
  content.prepend(textDiv);
}
