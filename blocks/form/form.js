import { div } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const divId = 'one-form-target-div';

  block.appendChild(div({ id: divId }));

  block.classList.add('calcite-mode-dark');
  document.querySelector('.form-container').classList.add('calcite-mode-dark');

  window.initOneForm(divId, {
    divId,
    aemFieldServiceBasePath: '/content/experience\u002Dfragments/esri\u002Dsites/en\u002Dus/site\u002Dsettings/one\u002Dform\u002Dadmin/master',
    aemEditMode: 'false',
    mode: 'basic-progressive-form',
    formName: '2854884_Imagery Organic Traffic Campaign: Workflow to Asset LPs \u002D Contact Sales',
    formOpensInAModal: '',
    modalTitle: '',
    formModalLookup: '2854884_Imagery Organic Traffic Campaign: Workflow to Asset LPs \u002D Contact Sales',
    leftAligned: '',
    darkMode: 'true',
    transparentBackground: '',
    pardotHandler: 'https://go.esri.com/l/82202/2022\u002D05\u002D31/pnykw9',
    organicSfId: '7015x000001PKGoAAO',
    isolation: '',
    disablePersonalization: '' === 'true',
    inlineThankYouPage: '',
    thankYouFormType: 'high',
    thankYouBannerImage: '',
    thankYouAssetTitle: '',
    thankYouAssetType: 'Brochure',
    thankYouAssetPath: '',
    thankYouListName: '',
    thankYouHeader: '',
    thankYouMessage: '',
    mqlComment: 'Please review the \x27What Prompted Your Interest?\x27 field for follow up.',
    mqlBehavior: 'default',
    mqlFormHandler: '',
    gdprMode: '',
    showEventConsentCheckBoxes: '' === 'true',
    marketingConsentRequired: '',
    marketingConsentRequiredMessage: '',
    customMarketingConsentLabel: '',
    customMarketingConsentRequiredMessage: '',
    customContactConsentLabel: '',
    customContactConsentRequiredMessage: '',
    thankyouPageUrl: '',
    thankyouPageParams: '',
    sendEmail: '' === 'true',
    emailTo: '',
    emailCc: '',
    emailBcc: '',
    emailSubject: '',
    emailBody: '',
  });
}
