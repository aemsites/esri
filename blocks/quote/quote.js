import { createOptimizedPicture } from '../../scripts/aem.js';
import { domEl } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((divElement) => {
      if (
        divElement.children.length === 1
        && divElement.querySelector('picture')
      ) {
        divElement.className = 'cards-card-image';
      } else divElement.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));
  block.textContent = '';
  block.append(ul);

  const body = block.querySelector('.cards-card-body');

  body.children[0].classList.add('quote-text');
  body.children[1].classList.add('quote-author');
  body.children[2].classList.add('quote-location');

  const quoteIcon = domEl('calcite-icon', {
    icon: 'quote',
    class: 'quote-icon',
    appearance: 'solid',
    scale: 'l',
  });
  body.prepend(quoteIcon);
}
