import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  ul,
  li,
  div,
  p,
  domEl,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  block.querySelectorAll('img').forEach((image) => image
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]),
    ));

  const tabs = [...block.children].slice(1);
  const nav = div({ class: 'image-switcher-nav' }, ul({ class: 'nav-list' }));
  const navList = nav.children[0];

  let selectedIndex = 0;
  const changeSelectedTab = (index) => {
    tabs[selectedIndex].setAttribute('aria-hidden', 'true');
    navList.children[selectedIndex].classList.remove('active');
    navList.children[index].classList.add('active');
    tabs[index].setAttribute('aria-hidden', 'false');
    selectedIndex = index;
  };

  tabs.forEach((tab, index) => {
    const tabTitle = tab.children[0].children[0].textContent;
    const thumbnail = tab.querySelector('picture');
    thumbnail.parentElement.parentElement.removeChild(thumbnail.parentElement);

    const listItem = li({ class: 'nav-item' }, thumbnail, p(tabTitle));
    listItem.addEventListener('click', () => changeSelectedTab(index));

    navList.appendChild(listItem);
  });

  const imageSwitcherContent = block.children[0];
  imageSwitcherContent.classList.add('image-switcher-content');
  imageSwitcherContent.appendChild(nav);

  const imageSwitcherImages = div({ class: 'image-switcher-images' }, ...tabs);

  tabs.forEach((tab) => {
    const buttonContainer = tab.querySelector('.button-container');
    const url = buttonContainer.querySelector('a').href;
    const title = buttonContainer.querySelector('a').textContent;
    tab.children[0].classList.add('image-content');
    tab.children[1].classList.add('image-div');

    const link = domEl('calcite-link', { href: url, 'icon-end': 'arrow-right' }, title);
    buttonContainer.parentElement.replaceChild(link, buttonContainer);

    tab.setAttribute('aria-hidden', 'true');
    tab.setAttribute('role', 'tabpanel');
  });

  block.appendChild(imageSwitcherImages);
  changeSelectedTab(0);
}
