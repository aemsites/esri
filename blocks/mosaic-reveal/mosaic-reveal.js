import { h3 } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  block.classList.add('calcite-mode-dark');

  [...block.children].forEach((child) => {
    const titleText = child.querySelector('h3').textContent;

    child.children[0].appendChild(h3({ class: 'title' }, titleText));
  });
}
