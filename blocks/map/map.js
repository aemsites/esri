import {
  div, iframe, button, p, horizontalRule,
} from '../../scripts/dom-helpers.js';

function getMapFrame(url) {

  const mapFrame = iframe({
    id: 'map-frame',
    class: 'map-frame-aspect-ratio',
    role: 'application',
    src: url,
    sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox',
    allow: 'autoplay; geolocation;',
    allowfullscreen: 'true',
    tabindex: '0',
    loading: 'lazy',
    title: 'Esri locations map',
  });

  return mapFrame

}

function toggleFullscreen() {
  const mapWrapper = document.querySelector('#frame-wrapper');
  const mapFrame = document.querySelector('#map-frame');

  const minimizeButton = document.querySelector('.return-btn');

  if (window.screenTop && window.screenY) {
    mapWrapper.classList.toggle('is-fullscreen');
    mapFrame.classList.toggle('map-frame-aspect-ratio');
    minimizeButton.classList.toggle('btn-vis');
  } else {
    mapWrapper.classList.toggle('is-fullscreen');
    mapFrame.classList.toggle('map-frame-aspect-ratio');
    minimizeButton.classList.toggle('btn-vis');
  }
}

export default async function decorate(block) {
  const blockParams = block.querySelectorAll('p');

  const mapLink = blockParams[0].innerText;
  const textParameter = blockParams[1].innerText;
  block.textContent = '';

  const fullscreenButton = button(
    {
      class: 'btn btn-white',
      label: 'Enter full screen',
    },
  );

  fullscreenButton.innerHTML = 'Launch map full screen';

  const returnBtn = button(
    {
      class: 'return-btn btn',
      label: 'Exit full screen',
    },
  );

  returnBtn.innerHTML = 'Minimize Map';

  const gridContainer = div({ class: 'grid-container' });

  const iframContainer = div({ id: 'iframe-container' });
  const frameWrapper = div({ id: 'frame-wrapper' });
  frameWrapper.appendChild(getMapFrame(mapLink))

  const defaultContentContainer = document.querySelector('.map-container > .default-content-wrapper');

  const nodeTextParam = p();
  nodeTextParam.innerHTML = textParameter;
  const hr = horizontalRule({ class: 'separator center' });

  const gridContainerChildren = [defaultContentContainer, hr, nodeTextParam, returnBtn, fullscreenButton, iframContainer, frameWrapper]

  gridContainerChildren.forEach(child => {
    gridContainer.appendChild(child)
  })
  

  fullscreenButton.addEventListener('click', toggleFullscreen);
  returnBtn.addEventListener('click', toggleFullscreen);

  
  block.append(gridContainer)
}
