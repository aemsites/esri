import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';
import { span, ul, li } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const list = ul(...[...block.children].map((row) => li(...[...row.children].map((divElement) => {
    if (
      divElement.children.length === 1
      && divElement.querySelector('picture')
    ) {
      divElement.className = 'quote-block-image';
    } else divElement.className = 'quote-block-body';

    return divElement;
  }))));

  list.querySelectorAll('img').forEach((img) => img
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));
  block.textContent = '';
  block.append(list);

  const body = block.querySelector('.quote-block-body');

  body.children[0].classList.add('quote-text');
  body.children[1].classList.add('quote-author');
  body.children[2].classList.add('quote-location');

  const quoteIcon = span({ class: 'icon icon-quote' });
  body.prepend(quoteIcon);

  decorateIcons(block);
}
