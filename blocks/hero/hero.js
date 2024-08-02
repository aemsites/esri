export default function decorate(block) {
  const heroBlock = document.querySelector('.hero');
  const videoElement = document.createElement('video');
  const videoSrc = document.createElement('source');
  const videoAssets = heroBlock.querySelectorAll('a');

  videoSrc.setAttribute('type', 'video/mp4');
  videoElement.setAttribute('type', 'video/mp4');
  videoElement.setAttribute('muted', '');
  // videoSrc.setAttribute('src', videoAssets[1].getAttribute('title'));
  videoSrc.setAttribute('src', 'https://www.esri.com/content/dam/esrisites/en-us/about/about/about-2022/updates-10/about-overview-banner.mp4');

  if (videoElement) videoElement.append(videoSrc);
  if (videoAssets) heroBlock.prepend(videoElement);

  videoElement.play();
}
