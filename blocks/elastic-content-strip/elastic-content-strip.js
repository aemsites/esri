import { a } from '../../scripts/dom-helpers.js';

import {
  decorateInnerHrefButtonsWithArrowIcon
} from '../../scripts/scripts.js'

export default function decorate(block) {
  block.classList.add('calcite-mode-dark')

  block.querySelectorAll('.elastic-content-strip > div > div').forEach(div => {
    console.log('this is in queryselector all', div)
    
    const elasticContentWrapper = a({class: "elastic-content-link-wrapper"})
    div.parentNode.insertBefore(elasticContentWrapper, div)
    elasticContentWrapper.appendChild(div)
    console.log('this is elasticcontentwrapper', elasticContentWrapper)
  })

  block.querySelectorAll('.button-container').forEach((bc) => {
    console.log('in button container')
    bc.children[0].classList.remove("button")
    bc.children[0].classList.add("learn-more-icon-container")
  })

  decorateInnerHrefButtonsWithArrowIcon(block)
}
