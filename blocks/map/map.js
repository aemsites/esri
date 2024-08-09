import {
  div, iframe, button, p, horizontalRule,
} from '../../scripts/dom-helpers.js';

function toggleFullscreen() {
  const mapWrapper = document.querySelector('#eam-map-wrapper');
  const mapFrame = document.querySelector('#map-frame');

  const minimizeButton = document.querySelector('.return-btn');

  if (window.screenTop && window.screenY) {
    mapWrapper.classList.toggle('is-fullscreen');
    mapFrame.classList.toggle('map-frame-aspect-ratio')
    minimizeButton.classList.toggle('btn-vis');
  } else {
    mapWrapper.classList.toggle('is-fullscreen');
    mapFrame.classList.toggle('map-frame-aspect-ratio')
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

  const defaultContentContainer = document.querySelector('.map-container > .default-content-wrapper');
  const defaultContentHeading = document.querySelector('.map-container > .default-content-wrapper > h2');

  const nodeTextParam = p();
  nodeTextParam.innerHTML = textParameter;

  const hr = horizontalRule({ class: 'separator center' });
  const mapContentContainer = div({ class: 'map-content-container' }, defaultContentHeading, hr, nodeTextParam, returnBtn, fullscreenButton);
  defaultContentContainer.appendChild(mapContentContainer);

  fullscreenButton.addEventListener('click', toggleFullscreen);
  returnBtn.addEventListener('click', toggleFullscreen);

  const mapFrame = iframe({
    id: 'map-frame',
    class: 'map-frame-aspect-ratio',
    role: 'application',
    src: mapLink,
    sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox',
    allow: 'autoplay; geolocation;',
    allowfullscreen: 'true',
    tabindex: '0',
    loading: 'lazy',
    title: 'Experience builder application',
  });

  const gridContainer = div({ class: 'grid-container' });
  const eamAppWrapper = div({ id: 'eam-app-wrapper' });

  const eamMapFrameWrapper = div({ id: 'eam-map-wrapper' });
  eamAppWrapper.appendChild(eamMapFrameWrapper);
  gridContainer.appendChild(eamAppWrapper);
  eamMapFrameWrapper.appendChild(mapFrame);

  block.append(gridContainer);
}
