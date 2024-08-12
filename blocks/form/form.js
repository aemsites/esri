import { div } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const divId = 'one-form-target-div';
  const formId = 'vladtestform';

  block.appendChild(div({ id: divId }));

  block.classList.add('calcite-mode-dark');
  document.querySelector('.form-container').classList.add('calcite-mode-dark');

  window.initOneForm(divId, {
    divId,
    // mode: 'custom-form',
    mode: 'basic-progressive-form',
    darkMode: true,
    formName: formId,
    thankYouFormType: 'mql-optional-web-app',
    // customFormConfig: 'https://assets.esri.com/content/experience-fragments/esri-sites/en-us/forms/testing_sandbox/daniel-test/master',
    mqlBehavior: 'default',
    gdprMode: 'standard',
  });
}
