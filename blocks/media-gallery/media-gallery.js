import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    // modify card structure to have a card-content div
    for(let idx = 0; idx < block.children.length; ++idx) {
        const child = block.children[idx];
        child.classList.add('card');
        child.classList.add(`card-${idx}`);

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        console.log(block.classList);
        if(block.classList.contains('alternate-2-1')) {
            const startButton = document.createElement('button');
            startButton.classList.add('start-button');
            startButton.innerHTML = "<svg aria-hidden='true' class='svg' fill='currentColor' height='100%' viewBox='0 0 24 24' width='100%' xmlns='http://www.w3.org/2000/svg'><path d='M6 1.773l15 10.23L6 22.226z'></path></svg>";
            cardContent.appendChild(startButton);
        }
        
        const cardTitle = child.children[0].children[0];
        const cardDescription = child.children[0].children[1];

        cardTitle.classList.add('card-title');
        cardDescription.classList.add('card-description');

        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardDescription);

        child.children[0].appendChild(cardContent);
    }
}
