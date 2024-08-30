import {
    domEl,
    div,
    a,
    span,
    h2,
    p,
    calciteButton
  } from '../../scripts/dom-helpers.js';
  

function getDOMElements(hText, pText, buttonText, buttonHref) {
  
  const heading = h2({class: "location-presence-heading"}, hText)
  const text = p({class: "location-presence-text"}, pText)
  const findYourEsriOfficeButton = calciteButton({class: "location-presence-button", href: buttonHref}, buttonText)
  const contentWrapper = div({class: "location-content-container"}, heading, text, findYourEsriOfficeButton)
  return contentWrapper
}
export default function decorate() {
    const locationPresenceBlock = document.querySelector('.location-presence-wrapper > div > div > div');
    
    const [ heading, text, button ] = locationPresenceBlock.children

    const elements = getDOMElements(heading.textContent, text.textContent, button.children[0].textContent, button.children[0].href)

    console.log('these are the elements, ', heading, text, button)
    console.log('these are computed elements', elements)

    locationPresenceBlock.innerHTML = ""
    // locationPresenceBlock.classList.add("")

    locationPresenceBlock.appendChild(elements)
  }