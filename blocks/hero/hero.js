/**
 * Variant Sizes: xlarge, large (Default), medium, small
 */
export default function decorate() {
  const defaultSize = 'large';
  const heroWrapper = document.querySelector('.hero-wrapper');
  const contentContainer = heroWrapper.querySelector('.hero');
  const picturePath = heroWrapper.querySelector('picture');
  const videoElement = document.createElement('video');
  const videoSrc = document.createElement('source');
  const videoAssets = heroWrapper.querySelectorAll('a');
  const foregroundImg = heroWrapper.querySelectorAll('picture');
  const foregroundImgContainer = document.createElement('div');

  contentContainer.classList.add('half-container');
  foregroundImgContainer.className = 'hero block half-container';
  picturePath.classList.add('hero-picture');
  videoSrc.setAttribute('type', 'video/mp4');
  videoElement.setAttribute('type', 'video/mp4');
  videoElement.setAttribute('muted', '');
  videoElement.className = 'hero-video';
  videoSrc.setAttribute('src', videoAssets[1].getAttribute('href'));
  heroWrapper.classList.add(defaultSize);

  if (foregroundImgContainer) foregroundImgContainer.append(foregroundImg[1])
  if (videoElement) videoElement.append(videoSrc);
  if (videoAssets) heroWrapper.prepend(videoElement);
  if (heroWrapper) heroWrapper.prepend(picturePath);
  videoAssets[1].parentNode.remove();
  heroWrapper.append(foregroundImgContainer);

  videoElement.play();
}