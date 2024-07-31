
import { div } from '../../scripts/dom-helpers.js';

export default function decorate(block) {  
  const formDiv = div({ id: 'one-form-79d6aed4-cf96-4850-9b9c-51c73ee3e221' });
  block.appendChild(formDiv);

  window.personlization = {'optedOut': '','suppressed': '','first_name': '','last_name': '','company': '','email': '','job_title': '','department': '','country': '','industry': '','org_type': '','functional_role': '','relationship': '','ehash': '','country': '','marketingConsent': '','marketingConsentDate': '','crmId': '','esriSponsoredProgram': ''};
  document.body.addEventListener('one-form-loaded', function (e) {
    window.__formsLoaded = window.__formsLoaded || {};

    if (!window.__formsLoaded['one-form-79d6aed4\u002Dcf96\u002D4850\u002D9b9c\u002D51c73ee3e221']) {
      window.initOneForm('one-form-79d6aed4\u002Dcf96\u002D4850\u002D9b9c\u002D51c73ee3e221', {
        divId: 'one-form-79d6aed4\u002Dcf96\u002D4850\u002D9b9c\u002D51c73ee3e221',
        aemFieldServiceBasePath: '\/content\/experience\u002Dfragments\/esri\u002Dsites\/en\u002Dus\/site\u002Dsettings\/one\u002Dform\u002Dadmin\/master',
        aemEditMode: 'false',
        mode: 'basic-progressive-form',
        formName: '2854884_Imagery Organic Traffic Campaign: Workflow to Asset LPs \u002D Contact Sales',
        formOpensInAModal: '',
        modalTitle: '',
        formModalLookup: '2854884_Imagery Organic Traffic Campaign: Workflow to Asset LPs \u002D Contact Sales',
        leftAligned: '',
        darkMode: 'true',
        transparentBackground: '',
        pardotHandler: 'https:\/\/go.esri.com\/l\/82202\/2022\u002D05\u002D31\/pnykw9',
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

      window.__formsLoaded['one-form-79d6aed4\u002Dcf96\u002D4850\u002D9b9c\u002D51c73ee3e221'] = true;
    }
  });

  block.innerHTML += "<link rel='stylesheet' href='https://webapps-cdn.esri.com/CDN/one-form/one-form.css'><script async='' src='https://webapps-cdn.esri.com/CDN/one-form/one-form.js'></script>";
}


