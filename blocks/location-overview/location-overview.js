import {
    domEl,
    div,
    a,
    span,
    h2,
    p,
  } from '../../scripts/dom-helpers.js';
  
  function getLearnMoreIcon() {
    
    const learnMoreIcon = domEl("calcite-icon", {
      icon: 'arrowRight',
      scale: 's',
    }, "Learn more");

    const iconContainer = div({class: "learn-more-icon-container"}, learnMoreIcon)
    return iconContainer;
  }

  function getPanelIcon(iconPath = "") {
    // TODO, use iconPath
    const panelIcon = span({
        class: "location-overview-panel-icon icon icon-building-classical-32"
    })

    return panelIcon
  }

  function getContainerContents(hText, pText, panelIconPath ) {
    const panelIcon = getPanelIcon(panelIconPath)
    const lernMoreIcon = getLearnMoreIcon()

    const overviewCardHeader = h2({
        class: "location-overview-card-header",
        textContent: hText || "bla bla bla header",
    })
    

    const overviewCardText = p({
        class: "location-overview-card-text",
        textContent: "bla bla bla text"
    })

    const contentsWrapper = div({
        class: "location-overview-content-wrapper calcite-animate calcite-animate__in-up"
    }, panelIcon, overviewCardHeader, overviewCardText, lernMoreIcon)

    return contentsWrapper
  }
  function getLinkWrapper(link) {
    const linkWrapper = a({
    class: "location-overview-link-wrapper",
    href: link
    }, getContainerContents())


    return linkWrapper
  }


  
  function getLocationOverviewDomElements(cardCount, headingTexts, genericTexts, cardLinks) {
    // overviewWrapper wraps around all our containers
    const overviewWrapper = div({class: "location-overview-container-wrapper"})

    for (let i =0; i < cardCount; i++) {
        const card = div({class: "location-overview-card-container calcite-mode-dark",}, getLinkWrapper(cardLinks[i]))
        overviewWrapper.appendChild(card)
    }
    
    return overviewWrapper;
  }
  export default function decorate() {
    const locationOverviewCards = document.querySelector('.location-overview-wrapper > div');

    const cardHeadingTexts = []
    const cardGenericText = []
    const overviewCardLinks  = []
    const overviewCards = locationOverviewCards.children.length
    console.log('locationoverview', locationOverviewCards)
    for (const card of locationOverviewCards.children) {
        console.log('this is card', card)
        for (let c of card.children) {
        console.log('this is individual card', c.children[0].innerText)
        const hText = c.children[0].innerText
        const link = c.children[0].children[0].href
        const pText = c.children[1].innerText
        cardHeadingTexts.push(hText)
        overviewCardLinks.push(link)
        cardGenericText.push(pText)
        }
    }

    const locationOverviewDOMElements = getLocationOverviewDomElements(
        overviewCards, cardHeadingTexts, cardGenericText, overviewCardLinks
        )
    locationOverviewCards.innerHTML = ''
    console.log('THIS IS IT !!!', locationOverviewCards)
    locationOverviewCards.appendChild(locationOverviewDOMElements)
    
    // each card has loc
  }
  