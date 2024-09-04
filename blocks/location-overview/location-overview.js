import {
  domEl,
  div,
  a,
  span,
  h2,
  p,
} from '../../scripts/dom-helpers.js';

import {
  decorateIcons,
} from '../../scripts/aem.js';

function getLearnMoreIcon() {
  const learnMoreIcon = domEl('calcite-icon', {
    icon: 'arrowRight',
    scale: 's',
  });

  const iconContainer = div({ class: 'learn-more-icon-container' }, 'Learn more', learnMoreIcon);
  return iconContainer;
}

function getPanelIcon(iconPath = '') {
  const panelIcon = span({
    class: iconPath || 'location-overview-panel-icon icon icon-2-5d-mesh-48',
  });

  return panelIcon;
}

function getContainerContents(hText, pText, panelIconPath) {
  const panelIcon = getPanelIcon(panelIconPath);
  const lernMoreIcon = getLearnMoreIcon();

  const overviewCardHeader = h2({
    class: 'location-overview-card-header',
  }, hText);

  const overviewCardText = p({
    class: 'location-overview-card-text',
  }, pText);

  const contentsWrapper = div({
    class: 'location-overview-content-wrapper calcite-animate calcite-animate__in-up',
  }, panelIcon, overviewCardHeader, overviewCardText, lernMoreIcon);

  return contentsWrapper;
}
function getLinkWrapper(hText, pText, cardLinkTo) {
  const linkWrapper = a({
    class: 'location-overview-link-wrapper',
    href: cardLinkTo,
  }, getContainerContents(hText, pText));

  return linkWrapper;
}

function getLocationOverviewDomElements(cardCount, headingTexts, genericTexts, cardLinks) {
  const overviewWrapper = div({ class: 'location-overview-container-wrapper' });

  for (let i = 0; i < cardCount; i += 1) {
    const card = div({ class: 'location-overview-card-container' }, getLinkWrapper(headingTexts[i], genericTexts[i], cardLinks[i]));
    overviewWrapper.appendChild(card);
  }

  return overviewWrapper;
}
export default function decorate(block) {
  block.classList.add('calcite-mode-dark')
  const locationOverviewCards = document.querySelector('.location-overview-wrapper > div');

  const cardHeadingTexts = [];
  const cardGenericText = [];
  const overviewCardLinks = [];

  const overviewCards = locationOverviewCards.children.length;
  [...locationOverviewCards.children].forEach((card) => {
    [...card.children].forEach((c) => {
      cardHeadingTexts.push(c.children[0].innerText);
      overviewCardLinks.push(c.children[2].children[0].href);
      cardGenericText.push(c.children[1].innerText);
    });
  });

  const locationOverviewDOMElements = getLocationOverviewDomElements(
    overviewCards,
    cardHeadingTexts,
    cardGenericText,
    overviewCardLinks,
  );
  locationOverviewCards.innerHTML = '';
  decorateIcons(locationOverviewDOMElements);
  locationOverviewCards.appendChild(locationOverviewDOMElements);
}
