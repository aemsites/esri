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
  videoAnchor.innerText = '';
  videoAnchor.appendChild(playButton);

  const videoButtonWrapper = div({ class: 'calcite-button-wrapper calcite-button-wrapper--nomargin video-play-button' }, videoAnchor);
  return videoButtonWrapper;
}

function getContactOfficeDomElements(heading, button, ...media) {
  const contentWrapper = div({ class: 'about-content-wrapper' });
  const headingWrapper = div({ class: 'about-heading-wrapper' });
  headingWrapper.appendChild(heading);
  const buttonWrapper = div(
    { class: 'about-button-wrapper calcite-button-wrapper calcite-animate calcite-animate__in-up' },
    convertToCalciteButton(button),
  );
  const mediaWrapper = div({ class: 'about-media-wrapper' });
  media.forEach((m) => {
    mediaWrapper.appendChild(m);
  });

  const contentChildren = [headingWrapper, buttonWrapper, mediaWrapper];

  contentChildren.forEach((child) => {
    contentWrapper.appendChild(child);
  });

  return contentWrapper;
}
export default function decorate(block) {
  const aboutMainContent = block.querySelector(':scope > div > div');

  const aboutMainHeading = aboutMainContent.children[0];
  aboutMainHeading.classList.add('about-main-heading');
  const aboutContactButton = aboutMainContent.children[1];
  const videoAnchor = aboutMainContent.querySelector(':scope > div > div > p:last-child > a');
  console.log('video anchor', videoAnchor);

  const videoElement = getVideoInteractionElement(videoAnchor);
  const mediaContent = aboutMainContent.children[2].children[0];

  const button = aboutContactButton.children[0];

  const elems = getContactOfficeDomElements(
    aboutMainHeading,
    button,
    mediaContent,
    videoElement,
  );

  const contentParent = aboutMainContent.parentNode;
  contentParent.removeChild(aboutMainContent);
  contentParent.appendChild(elems);
}
