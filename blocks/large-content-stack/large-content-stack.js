import { calciteButton, div } from '../../scripts/dom-helpers.js';

function convertToCalciteButton(button) {
  return calciteButton({
    'icon-end': 'arrowRight',
    href: button.href,
    appearance: 'outline',
    alignment: 'center',
    scale: 'm',
    type: 'button',
    width: 'auto',
    kind: 'inverse',
  }, button.textContent);
}

function getVideoInteractionElement(videoAnchor) {
  if (!videoAnchor || !videoAnchor.href) {
    // variant without video
    return div();
  }

  const playButton = calciteButton({
    kind: 'neutral',
    color: 'neutral',
    appearance: 'solid',
    label: 'Play this video',
    alignment: 'center',
    width: 'auto',
    type: 'button',
    scale: 'l',
    round: '',
    'icon-end': 'play-f',
  });

  videoAnchor.classList.add('video-play-anchor');
  videoAnchor.replaceChildren(playButton);

  return div({ class: 'calcite-button-wrapper calcite-button-wrapper--nomargin video-play-button' }, videoAnchor);
}

function getContactOfficeDomElements(heading, button, ...media) {
  return div(
    { class: 'about-content-wrapper' },
    div({ class: 'about-heading-wrapper' }, heading),
    div(
      { class: 'about-button-wrapper calcite-button-wrapper calcite-animate calcite-animate__in-up' },
      convertToCalciteButton(button),
    ),
    div({ class: 'about-media-wrapper' }, ...media),
  );
}

export default function decorate(block) {
  const mainCell = block.querySelector(':scope > div > div');

  const aboutMainHeading = mainCell.children[0];
  aboutMainHeading.classList.add('about-main-heading');
  const aboutContactButton = mainCell.children[1];
  const videoAnchor = mainCell.querySelector(':scope > p:nth-last-child(2) > a');

  const videoElement = getVideoInteractionElement(videoAnchor);
  const mediaContent = mainCell.children[2].children[0];

  const button = aboutContactButton.children[0];

  // TODO background picture quality is low, fix it
  const backgroundPicture = mainCell.querySelector(':scope > p:last-child > picture');

  const elems = getContactOfficeDomElements(
    aboutMainHeading,
    button,
    mediaContent,
    videoElement,
  );

  const backgroundPictureSrc = backgroundPicture.querySelector('source').srcset;
  elems.style.backgroundImage = `url(${backgroundPictureSrc})`;

  block.replaceChildren(elems);
}
