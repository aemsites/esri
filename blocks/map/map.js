import {
  div, iframe, button, p, horizontalRule,
} from '../../scripts/dom-helpers.js';

function embedMapFrame(block, url) {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }
  const gridContainer = div({ class: 'grid-container' });
  const iframContainer = div({ id: 'iframe-container' });

  const eamMapFrameWrapper = div({ id: 'frame-wrapper' });
  iframContainer.appendChild(eamMapFrameWrapper);
  gridContainer.appendChild(iframContainer);

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

  eamMapFrameWrapper.appendChild(mapFrame);
  block.classList.add('embed-is-loaded');
  block.append(gridContainer);
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

  const defaultContentContainer = document.querySelector('.map-container > .default-content-wrapper');
  const defaultContentHeading = document.querySelector('.map-container > .default-content-wrapper > h2');

  const nodeTextParam = p();
  nodeTextParam.innerHTML = textParameter;

  const hr = horizontalRule({ class: 'separator center' });
  const mapContentContainer = div({ class: 'map-content-container' }, defaultContentHeading, hr, nodeTextParam, returnBtn, fullscreenButton);
  defaultContentContainer.appendChild(mapContentContainer);

  fullscreenButton.addEventListener('click', toggleFullscreen);
  returnBtn.addEventListener('click', toggleFullscreen);

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      embedMapFrame(block, mapLink);
    }
  });
  observer.observe(block);
}
