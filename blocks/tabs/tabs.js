import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  domEl,
  div,
  ul,
  li,
  button,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  document.querySelector('.tabs-container').classList.add('calcite-mode-dark');

  block.querySelectorAll('img').forEach((img) => img
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));

  const tabTitles = [...block.children].map((child) => child.children[0].children[0].textContent);
  const tabContents = [...block.children].map((child) => [...child.children[1].children]);

  tabContents.forEach((content) => {
    const text = [content[1], content[2], content[3]];
    const textWrapper = div({ class: 'text-wrapper' }, ...text);
    content.splice(1, 3, textWrapper);

    const hrefs = [content[2].children[0].href, content[3].children[0].href];
    const buttons = [
      domEl('calcite-button', {
        'icon-end': 'play-f',
        href: hrefs[0],
        appearance: 'solid',
        alignment: 'center',
        scale: 'm',
        type: 'button',
        width: 'auto',
        kind: 'inverse',
        color: 'inverse',
        'calcite-hydrated': '',
      }, content[2].textContent),
      domEl('calcite-button', {
        'icon-end': 'arrowRight',
        href: hrefs[1],
        appearance: 'outline',
        alignment: 'center',
        scale: 'm',
        type: 'button',
        width: 'auto',
        kind: 'inverse',
        'calcite-hydrated': '',
      }, content[3].textContent),
    ];

    const buttonsWrapper = div({ class: 'buttons-wrapper' }, ...buttons);
    content.splice(2, 2, buttonsWrapper);
  });

  const contents = tabContents.map((content) => div({ class: 'tab-content' }, ...content));
  const titles = tabTitles.map((title) => li({ class: 'tab-title', 'aria-hidden': true, 'aria-selected': false }, button(...title)));

  const arrowLeft = domEl(
    'calcite-button',
    {
      class: 'arrow-button left',
      'aria-hidden': 'true',
      'icon-end': 'chevronLeft',
      scale: 'l',
      kind: 'neutral',
      round: '',
    },
  );

  const arrowRight = domEl(
    'calcite-button',
    {
      class: 'arrow-button right',
      'icon-end': 'chevronRight',
      scale: 'l',
      kind: 'neutral',
      round: '',
    },
  );

  let visibleTitleIdx = 0;
  arrowLeft.addEventListener('click', () => {
    const newVisibleTitleIdx = visibleTitleIdx - 1;
    if (newVisibleTitleIdx < 0) return;
    if (newVisibleTitleIdx === 0) arrowLeft.setAttribute('aria-hidden', 'true');
    arrowRight.setAttribute('aria-hidden', 'false');

    titles[visibleTitleIdx].setAttribute('aria-hidden', 'true');
    titles[newVisibleTitleIdx].setAttribute('aria-hidden', 'false');

    visibleTitleIdx = newVisibleTitleIdx;
  });

  arrowRight.addEventListener('click', () => {
    const newVisibleTitleIdx = visibleTitleIdx + 1;
    if (newVisibleTitleIdx >= titles.length) return;
    if (newVisibleTitleIdx === titles.length - 1) arrowRight.setAttribute('aria-hidden', 'true');
    arrowLeft.setAttribute('aria-hidden', 'false');

    titles[visibleTitleIdx].setAttribute('aria-hidden', 'true');
    titles[newVisibleTitleIdx].setAttribute('aria-hidden', 'false');

    visibleTitleIdx = newVisibleTitleIdx;
  });

  const calciteTabs = div(
    { class: 'tab-component' },
    ul(
      { class: 'tab-nav' },
      arrowLeft,
      ...titles,
      arrowRight,
    ),
    ...contents,
  );
  let selectedIdx = 0;
  contents[selectedIdx].setAttribute('aria-selected', 'true');
  titles[selectedIdx].setAttribute('aria-selected', 'true');

  titles[visibleTitleIdx].setAttribute('aria-hidden', 'false');

  titles.forEach((title, index) => {
    title.addEventListener('click', () => {

      titles[selectedIdx].setAttribute('aria-selected', 'false');
      contents[selectedIdx].setAttribute('aria-selected', 'false');

      titles[index].setAttribute('aria-selected', 'true');
      contents[index].setAttribute('aria-selected', 'true');
      selectedIdx = index;
    });
  });

  block.replaceChildren(calciteTabs);
}
