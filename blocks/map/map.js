import { div,iframe, button, p } from '../../scripts/dom-helpers.js'


async function toggleFullscreen() {
  
  const mapFrame = document.querySelector('#eam-map-wrapper')
  console.log("this is element by id", mapFrame)
  const minimizeButton = document.querySelector(".return-btn")


if (window.screenTop && window.screenY) {
  mapFrame.classList.toggle("is-fullscreen")
  minimizeButton.classList.toggle("btn-vis")
} else {
  mapFrame.classList.toggle("is-fullscreen")
  minimizeButton.classList.toggle("btn-vis")

}
}

export default async function decorate(block) {
  
  const blockParams = block.querySelectorAll('p')

  const mapLink = blockParams[0].innerText;
  const textParameter = blockParams[1].innerText;
  block.textContent = '';

  
  const fullscreenButton = button(
    {
      class: 'btn btn-white',
      label: 'Enter full screen',
    },
  );

  fullscreenButton.innerHTML = "Launch map full screen"

  const returnBtn = button(
    {
      class: "return-btn btn",
      label: 'Exit full screen',
    },
  );

  returnBtn.innerHTML = "Minimize Map"

  const contentContainer = document.querySelector('.map-container > .default-content-wrapper');
  const nodeTextParam = p()
  nodeTextParam.innerHTML = textParameter
  contentContainer.appendChild(nodeTextParam)
  contentContainer.appendChild(returnBtn)
  contentContainer.appendChild(fullscreenButton)
  

  fullscreenButton.addEventListener('click', toggleFullscreen);
  returnBtn.addEventListener('click', toggleFullscreen);

  const mapFrame = iframe({
    id: "map-frame",
    role:"application",
    src: mapLink,
    sandbox:"allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox",
    allow: "autoplay; geolocation;",
    allowfullscreen:"true",
    tabindex:"0",
    // border: "none",
    loading:"lazy", 
    width:"100%",
    // innerHeight: "100%",
    style:"aspect-ratio: auto 5 / 4; border: none;",
    title: "Experience builder application",
   })

    const gridContainer = div({class: "grid-container"})
    const eamAppWrapper = div({id: "eam-app-wrapper"})
  
    const eamMapFrameWrapper = div({id: "eam-map-wrapper"})
    eamAppWrapper.appendChild(eamMapFrameWrapper)
    gridContainer.appendChild(eamAppWrapper)
    eamMapFrameWrapper.appendChild(mapFrame)

    block.append(gridContainer);


}
