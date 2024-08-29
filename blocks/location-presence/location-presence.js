import {
    domEl,
    div,
    a,
    span,
    h2,
    p,
  } from '../../scripts/dom-helpers.js';
  


export default function decorate() {
    const locationPresenceBlock = document.querySelector('.location-presence-wrapper > div > div > div');
    
    const [ heading, text, button ] = locationPresenceBlock.children
    console.log('these are the elements, ', heading, text, button)

    
    // const overviewCards = locationOverviewCards.children.length;
    // [...locationOverviewCards.children].forEach((card) => {
    //   Array.from(card.children).forEach((c) => {
    //     cardHeadingTexts.push(c.children[0].innerText);
    //     overviewCardLinks.push(c.children[0].children[0].href);
    //     cardGenericText.push(c.children[1].innerText);
    //   });
    // });
  
    // const locationOverviewDOMElements = getLocationOverviewDomElements(
    //   overviewCards,
    //   cardHeadingTexts,
    //   cardGenericText,
    //   overviewCardLinks,
    // );
    // locationOverviewCards.innerHTML = '';
    // decorateIcons(locationOverviewDOMElements);
    // locationOverviewCards.appendChild(locationOverviewDOMElements);
  }