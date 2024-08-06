import {
    loadScript,
    loadCSS
  } from '../../scripts/aem.js';

import { div,iframe, calciteButton } from '../../scripts/dom-helpers.js'


function toggleFullscreen() {
  let elem = document.querySelector("#map-frame");

  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch((err) => {
      alert(
        `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`,
      );
    });
  } else {
    document.exitFullscreen();
  }
}

export default async function decorate(block) {

  const fullscreenButton = calciteButton(
    {
      class: 'arrow-button right',
      label: 'Next Tab',
      'icon-end': 'chevronRight',
      scale: 'l',
      kind: 'neutral',
      round: '',
    },
  );

  const contentContainer = document.querySelector('.map-container > .default-content-wrapper');
  contentContainer.appendChild(fullscreenButton)

  fullscreenButton.addEventListener('click', toggleFullscreen);

  const mapFrame = iframe({
    id: "map-frame",
    role:"application",
    src: "https://webapps-cdn.esri.com/Apps/regional-maps/europe.html",
    sandbox:"allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox",
    allow: "autoplay; geolocation;",
    allowfullscreen:"true",
    tabindex:"0",
    // border: "none",
    loading:"lazy", 
    width:"100%",
    style:"aspect-ratio: auto 16 / 12; border: none;",
    title: "Experience builder application",
   })

    const gridContainer = div({id: "grid-container"})
    gridContainer.appendChild(mapFrame)

    block.append(gridContainer);

    await loadScript('https://js.arcgis.com/4.9/')
    await loadCSS("https://js.arcgis.com/4.30/@arcgis/core/assets/esri/themes/light/main.css")
}
