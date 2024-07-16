import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    // modify card structure to have a card-content div
    for(let idx = 0; idx < block.children.length; ++idx) {
        const child = block.children[idx];
        child.classList.add(`card-${idx}`);

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const cardTitle = child.children[0].children[0];
        const cardDescription = child.children[0].children[1];

        cardTitle.classList.add('card-title');
        cardDescription.classList.add('card-description');

        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardDescription);

        child.children[0].appendChild(cardContent);
    }
}
