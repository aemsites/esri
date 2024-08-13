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
    allow: 'autoplay; geolocation; fullscreen;',
    tabindex: '0',
    loading: 'lazy',
    title: 'Esri locations map',
  });

  return mapFrame;
}

function toggleFullscreen() {
  const mapWrapper = document.querySelector('#frame-wrapper');
  const minimizeButton = document.querySelector('.return-btn');

  if (window.screenTop && window.screenY) {
    mapWrapper.classList.toggle('is-fullscreen');
    minimizeButton.classList.toggle('btn-vis');
  } else {
    mapWrapper.classList.toggle('is-fullscreen');
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

  fullscreenButton.textContent = 'Launch map full screen';

  const returnBtn = button(
    {
      class: 'return-btn btn',
      label: 'Exit full screen',
    },
  );

  returnBtn.textContent = 'Minimize Map';

  const gridContainer = div({ class: 'grid-container' });
  const frameWrapper = div({ id: 'frame-wrapper' });
  frameWrapper.appendChild(getMapFrame(mapLink));

  const defaultContentContainer = document.querySelector('.map-container > .default-content-wrapper');
  const nodeTextParam = p({ id: 'map-text-content' });
  nodeTextParam.textContent = textParameter;
  const hr = horizontalRule({ class: 'separator center' });

  const contentWrapperChildren = [
    defaultContentContainer, hr, nodeTextParam, returnBtn, fullscreenButton,
  ];
  const defaultContentWrapper = div({ id: 'map-default-content-wrapper' });

  contentWrapperChildren.forEach((child) => {
    defaultContentWrapper.appendChild(child);
  });

  const gridContainerChildren = [defaultContentWrapper, frameWrapper];

  gridContainerChildren.forEach((child) => {
    gridContainer.appendChild(child);
  });

  fullscreenButton.addEventListener('click', toggleFullscreen);
  returnBtn.addEventListener('click', toggleFullscreen);

  block.append(gridContainer);
}
