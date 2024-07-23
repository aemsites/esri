import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  domEl,
  div,
  ul,
  li,
  button,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  block.classList.add('calcite-mode-dark');

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

  const contents = tabContents.map((content, index) => div({ class: 'tab-content', id: `tab-content-${index}` }, ...content));
  const titles = tabTitles.map((title, index) => li({ class: 'tab-title', id: `tab-title-${index}` }, button(...title)));

  const arrowLeft = button(
    { class: 'arrow-button left' },
    domEl('calcite-icon', {
      icon: 'chevronLeft',
      scale: 'm',
      'aria-hidden': 'true',
      'calcite-hydrated': '',
    }),
  );
  arrowLeft.style.display = 'none';

  const arrowRight = button(
    { class: 'arrow-button right' },
    domEl('calcite-icon', {
      icon: 'chevronRight',
      scale: 'm',
      'aria-hidden': 'true',
      'calcite-hydrated': '',
    }),
  );

  let visibleTitleIdx = 0;
  arrowLeft.addEventListener('click', () => {
    const newVisibleTitleIdx = visibleTitleIdx - 1;
    if (newVisibleTitleIdx < 0) return;
    if (newVisibleTitleIdx === 0) arrowLeft.style.display = 'none';
    arrowRight.style.display = 'block';

    titles[visibleTitleIdx].classList.toggle('visible');
    titles[newVisibleTitleIdx].classList.toggle('visible');

    visibleTitleIdx = newVisibleTitleIdx;
  });

  arrowRight.addEventListener('click', () => {
    const newVisibleTitleIdx = visibleTitleIdx + 1;
    if (newVisibleTitleIdx >= titles.length) return;
    if (newVisibleTitleIdx === titles.length - 1) arrowRight.style.display = 'none';
    arrowLeft.style.display = 'block';

    titles[visibleTitleIdx].classList.toggle('visible');
    titles[newVisibleTitleIdx].classList.toggle('visible');

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

  contents[0].classList.toggle('selected');
  titles[0].classList.toggle('selected');
  titles[visibleTitleIdx].classList.toggle('visible');

  titles.forEach((title, index) => {
    title.addEventListener('click', () => {
      block.querySelectorAll('.selected').forEach((selected) => selected.classList.remove('selected'));

      title.classList.add('selected');
      contents[index].classList.add('selected');
    });
  });

  while (block.firstChild) block.removeChild(block.firstChild);
  block.appendChild(calciteTabs);
}
