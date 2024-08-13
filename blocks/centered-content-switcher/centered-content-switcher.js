import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  calciteButton,
  ul,
  li,
  div,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  block.classList.add('calcite-mode-dark');
  document.querySelector('.centered-content-switcher-container').classList.add('calcite-mode-dark');

  block.querySelectorAll('img').forEach((img) => img
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));

  let selectedIdx = 0;
  const NUM_TABS = block.children.length;

  const changeSelectedTab = (index) => {
    const dots = block.querySelectorAll('.mobile-nav-dots');

    dots.forEach((list) => list.children[selectedIdx].classList.remove('active'));
    block.children[selectedIdx].setAttribute('aria-hidden', 'true');

    selectedIdx = index;

    dots.forEach((list) => list.children[selectedIdx].classList.add('active'));
    block.children[selectedIdx].setAttribute('aria-hidden', 'false');
  };

  [...block.children].forEach((child) => {
    child.setAttribute('aria-hidden', 'true');
    child.setAttribute('role', 'tabpanel');

    // child.addEventListener('click', () => changeSelectedTab(idx));

    const imgUrl = child.children[1].querySelector('a').href;
    child.removeChild(child.children[1]);

    child.setAttribute('style', `background-image: url(${imgUrl})`);

    const anchor = child.querySelector('a');
    const playButton = calciteButton({
      'icon-start': 'play-f',
      appearance: 'solid',
      kind: 'inverse',
      scale: 'l',
      round: '',
      href: anchor.href,
    });
    anchor.parentElement.appendChild(playButton);
    anchor.parentElement.removeChild(anchor);

    // add mobile navigation
    const previousButton = calciteButton({
      'icon-start': 'chevronLeft',
      appearance: 'transparent',
      kind: 'neutral',
      scale: 'l',
      round: '',
    });
    const nextButton = calciteButton({
      'icon-end': 'chevronRight',
      appearance: 'transparent',
      kind: 'neutral',
      scale: 'l',
      round: '',
    });
    previousButton.addEventListener('click', () => changeSelectedTab((selectedIdx + NUM_TABS - 1) % NUM_TABS));
    nextButton.addEventListener('click', () => changeSelectedTab((selectedIdx + 1) % NUM_TABS));

    const mobileNav = div(
      { class: 'mobile-nav' },
      previousButton,
      ul(
        { class: 'mobile-nav-dots' },
        ...[...block.children].map((_, idx) => {
          const listItem = li({ class: idx === selectedIdx ? 'active' : '' });
          listItem.addEventListener('click', () => changeSelectedTab(idx));
          return listItem;
        }),
      ),
      nextButton,
    );

    child.appendChild(mobileNav);
  });
  block.children[selectedIdx].setAttribute('aria-hidden', 'false');
}
