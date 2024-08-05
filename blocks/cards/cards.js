import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  block.classList.add('calcite-mode-dark');

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else { div.className = 'cards-card-body'; }

      /* cards simple */
      if (block.classList.contains('cards') && block.classList.contains('simple')) {
        const anchorEl = div.querySelector('a');
        if (anchorEl) {
          anchorEl.textContent = '';
          div.append(anchorEl);
          div.querySelector('.button-container').remove();
        }
        const cardBodyContent = document.createElement('div');
        cardBodyContent.className = 'card-body-content';
        if (anchorEl) {
          anchorEl.append(cardBodyContent);
        } else {
          div.append(cardBodyContent);
        }

        [...div.querySelectorAll('.cards-card-body > :not(.card-body-content, a)')].forEach((el) => {
          cardBodyContent.append(el);
        });
      }
      /* END of cards simple */
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
