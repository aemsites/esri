import { calciteButton, domEl } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      } else {
        col.classList.add('columns-text-col');
      }
    });
  });

  const buttonContainers = block.querySelectorAll('.button-container');
  if (buttonContainers.length > 0) {
    const btn = calciteButton(
      {
        appearance: 'outline',
        kind: 'brand',
        color: 'blue',
        'icon-end': 'arrow-right',
        href: buttonContainers[0].children[0].href,
      },
      buttonContainers[0].children[0].textContent,
    );
    buttonContainers[0].replaceChild(btn, buttonContainers[0].children[0]);
  }

  if (buttonContainers.length > 1) {
    const link = domEl(
      'calcite-link',
      {
        href: buttonContainers[1].children[0].href,
        'icon-end': 'arrow-right',
        color: 'blue',
      },
      buttonContainers[1].children[0].textContent,
    );
    buttonContainers[1].replaceChild(link, buttonContainers[1].children[0]);
  }

  const parentEl = buttonContainers[0]?.parentElement;
  const buttonContainerWrapper = domEl('div', { class: 'button-container-wrapper' }, ...buttonContainers);
  parentEl?.appendChild(buttonContainerWrapper);
}
