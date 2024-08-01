// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// Launch script
const script = document.createElement('script');
script.src = 'https://assets.adobedtm.com/launch-ENd3e1f5f2e5b44e4f8c9e7b0c4a2f8b3.min.js';
script.async = true;
document.body.appendChild(script);
