import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  calciteButton,
  ul,
  li,
  div,
  img,
  p,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  block.classList.add('calcite-mode-dark');
  document.querySelector('.centered-content-switcher-container').classList.add('calcite-mode-dark');

  block.querySelectorAll('img').forEach((image) => image
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]),
    ));

  let selectedIdx = 0;
  const NUM_TABS = block.children.length;
  const mediaQuery = window.matchMedia('(width <= 1024px)');

  const changeSelectedTab = (index) => {
    const dots = block.querySelectorAll('.mobile-nav-dots');
    const desktopLists = block.querySelectorAll('.desktop-nav-list');

    const currentTab = block.children[selectedIdx];
    const nextTab = block.children[index];

    dots.forEach((list) => [...list.children].forEach((child) => child.classList.remove('active')));
    desktopLists.forEach((list) => [...list.children].forEach((child) => child.classList.remove('active')));
    currentTab.setAttribute('aria-hidden', 'true');
    currentTab.classList.remove('calcite-animate__in');
    currentTab.classList.add('animate-out');
    currentTab.children[0].classList.remove('calcite-animate__in-up');
    currentTab.children[1].classList.remove('calcite-animate__in-up');

    selectedIdx = index;

    dots.forEach((list) => list.children[selectedIdx].classList.add('active'));
    desktopLists.forEach((list) => list.children[selectedIdx].classList.add('active'));
    nextTab.setAttribute('aria-hidden', 'false');
    nextTab.classList.add('calcite-animate__in');
    nextTab.classList.remove('animate-out');
    nextTab.children[0].classList.add('calcite-animate__in-up');
    nextTab.children[1].classList.add('calcite-animate__in-up');
  };

  // create mobile nav
  const previousButton = calciteButton({
    class: 'previous-button',
    'icon-start': 'chevronLeft',
    appearance: 'transparent',
    kind: 'neutral',
    scale: 'l',
    round: '',
  });
  const nextButton = calciteButton({
    class: 'next-button',
    'icon-end': 'chevronRight',
    appearance: 'transparent',
    kind: 'neutral',
    scale: 'l',
    round: '',
  });

  const mobileNav = div(
    { class: 'mobile-nav calcite-animate' },
    previousButton,
    ul(
      { class: 'mobile-nav-dots' },
      ...[...block.children].map((_, idx) => {
        const listItem = li({ class: idx === selectedIdx ? 'active' : ' ' });
        return listItem;
      }),
    ),
    nextButton,
  );

  // create desktop nav
  const desktopNav = div(
    { class: 'desktop-nav calcite-animate' },
    ul(
      { class: 'desktop-nav-list' },
      ...[...block.children].map((child, idx) => {
        const thumbnailUrl = child.children[0].children[2].querySelector('img').src;
        const headingText = child.querySelector('h2').textContent;

        const listItem = li(
          { class: idx === selectedIdx ? 'active' : '' },
          img({ src: thumbnailUrl }),
          p(headingText),
        );
        return listItem;
      }),
    ),
  );

  [...block.children].forEach((child) => {
    child.classList.add('calcite-animate');
    child.classList.add('animate-out');

    child.setAttribute('aria-hidden', 'true');
    child.setAttribute('role', 'tabpanel');

    child.children[0].classList.add('calcite-animate');

    const imgUrl = child.children[1].querySelector('img').src;
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
    child.children[0].appendChild(playButton);
    anchor.parentElement.parentElement.removeChild(anchor.parentElement);
  });

  const mobileNavClones = [...block.children].map(() => {
    const clone = mobileNav.cloneNode(true);
    clone.querySelector('.previous-button').addEventListener('click', () => changeSelectedTab((selectedIdx + NUM_TABS - 1) % NUM_TABS));
    clone.querySelector('.next-button').addEventListener('click', () => changeSelectedTab((selectedIdx + 1) % NUM_TABS));
    const listItems = [...clone.querySelector('.mobile-nav-dots').children];
    listItems.forEach((listItem, listItemIdx) => {
      listItem.addEventListener('click', () => changeSelectedTab(listItemIdx));
    });
    return clone;
  });

  const desktopNavClones = [...block.children].map(() => {
    const clone = desktopNav.cloneNode(true);
    const listItems = [...clone.querySelector('.desktop-nav-list').children];
    listItems.forEach((listItem, listItemIdx) => {
      listItem.addEventListener('click', () => changeSelectedTab(listItemIdx));
    });
    return clone;
  });

  const changeNavigation = (query) => {
    [...block.children].forEach((child, index) => {
      if (query.matches) {
        if (child.querySelector('.desktop-nav')) child.removeChild(desktopNavClones[index]);
        child.appendChild(mobileNavClones[index]);
      } else {
        if (child.querySelector('.mobile-nav')) child.removeChild(mobileNavClones[index]);
        child.appendChild(desktopNavClones[index]);
      }
    });
    changeSelectedTab(selectedIdx);
  };

  mediaQuery.onchange = changeNavigation;
  block.children[selectedIdx].setAttribute('aria-hidden', 'false');

  changeNavigation(mediaQuery);
}
