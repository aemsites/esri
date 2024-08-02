import { div, a } from '../../scripts/dom-helpers.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  block.classList.add('calcite-mode-light');
  block.querySelectorAll('img').forEach((img) => img
    .closest('picture')?.replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));

  const eventCardsWrapper = [...block.children].map(((child) => child.children[0]));
  const eventCards = eventCardsWrapper.map((wrapper) => [...wrapper.children]);

  for (let i = 0; i < eventCards.length; i += 1) {
    for (let j = 0; j < eventCards[i].length; j += 6) {
      eventCards[i][j].parentElement.removeChild(eventCards[i][j]);
      eventCards[i][j + 1].appendChild(eventCards[i][j + 2]);
      const eventCard = div(
        { class: 'event-card' },
        a(
          { href: eventCards[i][j].querySelector('a').href },
          eventCards[i][j + 1],
          div(
            { class: 'event-text-wrapper' },
            ...eventCards[i].slice(j + 3, j + 6),
          ),
        ),
      );
      eventCardsWrapper[i].append(eventCard);
    }
  }
}
