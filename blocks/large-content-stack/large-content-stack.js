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

  return div(videoAnchor);
}

export default function decorate(block) {
  console.log('decorating large content stack start');
  block.querySelectorAll('p').forEach((p, idx) => {
    p.classList.add(`about-p-${idx}`);
  });
  const mainCell = block.querySelector(':scope > div > div');

  const videoAnchor = mainCell.querySelector(':scope > p:nth-last-child(2) > a');
  videoAnchor.parentElement.remove();
  const videoElement = getVideoInteractionElement(videoAnchor);

  const button = block.querySelector('a');
  const newButton = convertToCalciteButton(button);
  button.replaceWith(newButton);

  // TODO background picture quality is low, fix it
  const backgroundPicture = mainCell.querySelector(':scope > p:last-child > picture');

  const backgroundPictureSrc = backgroundPicture.querySelector('source').srcset;
  block.style.backgroundImage = `url(${backgroundPictureSrc})`;
  backgroundPicture.parentElement.remove();

  const picture = block.querySelector('p > picture');
  const mediaWrapper = picture.parentElement;
  mediaWrapper.replaceWith(div(
    { class: 'about-media-wrapper' },
    picture,
    videoElement,
  ));

  //
  // block.replaceChildren(
  //   aboutMainHeading,
  //   div(
  //     { class: 'about-button-wrapper calcite-animate calcite-animate__in-up' },
  //     convertToCalciteButton(button),
  //   ),
  //   div({ class: 'about-media-wrapper' }, mediaContent, videoElement),
  // );

  console.log('decorating large content stack END');
}
