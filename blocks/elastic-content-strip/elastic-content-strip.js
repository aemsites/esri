import { a } from '../../scripts/dom-helpers.js';


import {
  decorateInnerHrefButtonsWithArrowIcon,
  decorateTemplateAndTheme
} from '../../scripts/scripts.js';


export default function decorate(block) {

  block.querySelectorAll('.elastic-content-strip > div > div').forEach((div) => {
    const elasticContentWrapper = a({
      class: 'elastic-content-link-wrapper',
      href: div.children[3].children[0].href,
    });
    div.parentNode.insertBefore(elasticContentWrapper, div);
    elasticContentWrapper.appendChild(div);

    decorateInnerHrefButtonsWithArrowIcon(elasticContentWrapper);
  });

  block.querySelectorAll('.button-container').forEach((bc) => {
    bc.children[0].classList.remove('button');
    bc.children[0].classList.add('learn-more-icon-container');
  });

  decorateTemplateAndTheme(block)
}
