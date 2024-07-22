import { createOptimizedPicture } from '../../scripts/aem.js';
import { domEl } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  block.querySelectorAll('img').forEach((img) => img
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));

    const tabTitles = [...block.children].map(child => child.children[0].children[0].textContent);
    const tabContents = [...block.children].map(child => [...child.children[1].children]);
    const calciteTabs = domEl(
      'calcite-tabs',
      domEl(
        'calcite-tab-nav',
        ...tabTitles.map(title => domEl('calcite-tab-title', title))),
        ...tabContents.map(content => domEl('calcite-tab', ...content)));

    while(block.firstChild) block.removeChild(block.firstChild);
    block.appendChild(calciteTabs);
}
