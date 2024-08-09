/* global WebImporter */
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import urls from './urls.js';

function createMetadata(main, document, pathname) {
  const meta = {};

  const urlInfo = urls.find(({ URL: url }) => (new URL(url).pathname) === pathname);
  meta.Theme = urlInfo.Theme;

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);
}

function createBlock(container, document, name, cells, variants = []) {
  container.replaceChildren(WebImporter.Blocks.createBlock(document, {
    name,
    cells,
    variants,
  }));
}

function hero(main, document) {
  const heroContainer = document
    .querySelector('div.hero-banner-global-v2.aem-GridColumn');
  if (!heroContainer) {
    return;
  }
  const heroInner = heroContainer.querySelector('.hbg-container');

  const backgroundImage = heroInner.querySelector('picture.hbg-container--large--backgroundImage');

  const videoContainer = heroInner.querySelector('.video-container');
  if (videoContainer) {
    heroInner.append(videoContainer);
    backgroundImage.remove();
  } else if (backgroundImage) {
    heroInner.append(backgroundImage);
  }

  createBlock(heroContainer, document, 'hero', [[heroInner]]);
}

function videos(main, document) {
  main.querySelectorAll('video')
    .forEach((video) => {
      const videoSrc = video.getAttribute('data-video-src');
      const videoPoster = video.getAttribute('poster');

      const videoLink = document.createElement('a');
      videoLink.setAttribute('href', videoSrc);
      videoLink.textContent = videoSrc;

      const img = document.createElement('img');
      img.setAttribute('src', videoPoster);

      const div = document.createElement('div');
      div.classList.add('video-container');
      div.appendChild(videoLink);
      div.appendChild(img);

      video.replaceWith(div);
    });
}

function calciteButton(main, document) {
  main.querySelectorAll('calcite-button')
    .forEach((button) => {
      const link = document.createElement('a');
      link.setAttribute('href', button.getAttribute('href'));
      link.textContent = button.textContent;
      button.replaceWith(link);
    });
}

function storyteller(main, document) {
  main.querySelectorAll('.storyteller__container')
    .forEach((container) => {
      const [leftChild, rightChild] = [...container.children];
      let cells = [[leftChild, rightChild]];
      if (!container.closest('.storyteller').classList.contains('st-content--left')) {
        cells = [[rightChild, leftChild]];
      }

      createBlock(container, document, 'storyteller', cells);
    });
}

function createIcon(iconName, originalURL) {
  const icon = document.createElement('span');
  icon.className = 'aem-icon';
  icon.textContent = `:${iconName}:`;
  icon.setAttribute('icon-name', iconName);
  icon.setAttribute('data-original-url', `${WebImporter.FileUtils.sanitizePath(originalURL)}`);

  return icon;
}

function getCardArrayFromContainer(container, document) {
  return [...container.querySelectorAll(':scope > ul > li > article')]
    .map((card) => {
      if (card.children.length === 1 && card.children[0].tagName === 'A') {
        const link = card.children[0];
        const newCard = document.createElement('div');
        const newLink = document.createElement('a');
        const href = link.getAttribute('href');
        newLink.setAttribute('href', href);
        newLink.textContent = href;
        newCard.append(newLink, ...link.children);
        return newCard;
      }

      return card;
    });
}

function tabs(main, document) {
  main.querySelectorAll('.esri-carousel,.esri-tabs')
    .forEach((container) => {
      const withIcons = container.classList.contains('tab-icons');
      let withCards = false;

      const cells = [...container.querySelectorAll('[role="tabpanel"]')]
        .map((tabContent) => {
          const tabLabelId = tabContent.getAttribute('aria-labelledby');
          const tabName = container.querySelector(`#${tabLabelId}`);
          const tabLabel = document.createElement('div');
          tabLabel.innerHTML = tabName.innerHTML;

          if (withIcons) {
            const tabIcon = tabContent.querySelector('.tab--icon > div');
            if (tabIcon) {
              const svgFileName = tabIcon.getAttribute('data-asset');
              const iconName = svgFileName
                .split('/')
                .pop()
                .split('-')
                .slice(0, -1)
                .join('-');
              const icon = document.createElement('p');
              icon.append(createIcon(iconName, tabIcon.getAttribute('data-asset')));
              tabIcon.remove();
              tabLabel.prepend(icon);
            }
          }

          const cardsContainer = tabContent.querySelector('.card-container-v3');
          if (cardsContainer) {
            withCards = true;
            const cardArray = getCardArrayFromContainer(cardsContainer, document);

            return [tabLabel, cardArray];
          }

          return [tabLabel, tabContent];
        });

      createBlock(container, document, 'tabs', cells, withCards ? ['cards'] : []);
    });
}

function createLink(document, href) {
  const url = (href.startsWith('/')) ? `https://www.esri.com${href}` : href;
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.textContent = url;

  return link;
}

function mediaGallery(main, document) {
  main.querySelectorAll('.media-gallery')
    .forEach((container) => {
      const mgCards = [...container.querySelectorAll('.mg__card')];
      const cells = mgCards
        .filter((card) => card.querySelector('.mg-card__wrapper'))
        .map((card) => {
          const wrapper = card.querySelector('.mg-card__wrapper');
          const href = wrapper.getAttribute('data-href') ?? wrapper.getAttribute('href');

          if (wrapper.tagName === 'A') {
            const div = document.createElement('div');
            div.append(...wrapper.children);
            wrapper.replaceWith(div);
          }
          const link = createLink(document, href);

          card.append(link);

          return [card];
        });

      function getCardWidth(card) {
        const firstChild = card.firstElementChild;
        return firstChild.getAttribute('data-card-width');
      }

      const variants = [];
      if (mgCards.length > 2 && getCardWidth(mgCards[0]) === '2' && getCardWidth(mgCards[1]) === '1') {
        variants.push('alternate-2-1');
      }

      createBlock(container, document, 'media-gallery', cells, variants);
    });
}

function cards(main, document) {
  main.querySelectorAll('.block-group')
    .forEach((container) => {
      const cells = [...container.querySelectorAll('.block')]
        .map((block) => [block]);

      createBlock(container, document, 'cards', cells, ['Block group']);
    });

  main.querySelectorAll('.card-container-v3')
    .forEach((container) => {
      const cells = getCardArrayFromContainer(container, document).map((card) => [card]);
      if (!cells) {
        throw new Error('No cards found', container.outerHTML);
      }

      const withVideo = cells.some((row) => row[0]
        .querySelector(':scope > a:first-child')
        ?.getAttribute('href')
        .startsWith('https://youtu.be/'));

      let blockName = 'cards';
      if (withVideo) {
        blockName = 'Video cards';
      }

      createBlock(container, document, blockName, cells);
    });
}

function callToAction(main, document) {
  main.querySelectorAll('.cta-questions_primary-dbl-button-column-container')
    .forEach((container) => {
      const children = [...container.children];
      if (children.length !== 3) {
        throw new Error('callToAction expected 3 children', container.outerHTML);
      }
      createBlock(container, document, 'Call to action', [[children[0], children[2]]]);
    });
}

function transformUrls(main) {
  const urlPathnames = urls.map(({ URL: url }) => new URL(url).pathname);

  main.querySelectorAll('a')
    .forEach((a) => {
      const href = a.getAttribute('href');
      if (!href.startsWith('/')) {
        return;
      }

      if (!urlPathnames.includes(href)) {
        const newUrl = `https://www.esri.com${href}`;
        a.setAttribute('href', newUrl);
        const trimmedContent = a.textContent.trim();
        if (trimmedContent === '' || trimmedContent === href) {
          a.textContent = newUrl;
        }
      }
    });
}

function map(main, document, html) {
  main.querySelectorAll('.raw-html-for-js-app').forEach((rawHtmlForJsApp) => {
    if (!rawHtmlForJsApp.querySelector('#eam-map-wrapper')) {
      console.error('eam-map-wrapper not found in raw-html-for-js-app', rawHtmlForJsApp);
      return;
    }

    const apiDataRegex = /axios.get\(\s*"([^"]+)"\s*\)/;
    const apiDataMatch = apiDataRegex.exec(html);
    const mapUrl = (apiDataMatch?.length >= 2) ? apiDataMatch[1] : 'TODO import map url correctly';

    main.querySelector('a#returnBtn').remove();
    main.querySelector('a#fullScreenButton').remove();

    const link = document.createElement('a');
    link.setAttribute('href', mapUrl);
    link.textContent = mapUrl;

    createBlock(rawHtmlForJsApp, document, 'map', [[link]]);
  });
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
  }
  // eslint-disable-next-line no-bitwise
  return (hash >>> 0).toString(36).padStart(7, '0');
}

function inlineIcons(main, html) {
  const iconNames = {
    '0gn1vbo': 'thumbsup',
    '0erguqf': 'locations',
    '0bg3tpq': 'employees',
    '0cusfqy': 'handshake',
    '0oy3ew8': 'headset',
    '0sr5z39': 'lightbulb',
  };

  const themeColorRegex = /--theme-color: (#[0-9a-fA-F]{6});/g;
  const themeColorMatch = themeColorRegex.exec(html);
  const themeColor = themeColorMatch[1];

  const foundIcons = {};

  main.querySelectorAll('.esri-text__iconContainer > svg')
    .forEach((icon) => {
      const path = icon.querySelector('path');
      if (!path.style.fill) {
        path.style.fill = themeColor;
      }

      icon.removeAttribute('class');
      icon.removeAttribute('id');
      path.removeAttribute('id');

      const iconHash = hashCode(icon.outerHTML);
      let iconName = iconNames[iconHash];
      if (!iconName) {
        console.error('Unknown icon hash', iconHash, icon);
        iconName = `pending-${iconHash}`;
      }

      foundIcons[iconName] = icon.outerHTML;

      icon.outerHTML = `:${iconName}:`;
    });

  return foundIcons;
}

function quote(main, document) {
  document.querySelectorAll('.quote').forEach((quoteEl) => {
    const container = quoteEl.closest('.column-24');
    if (!container) {
      throw new Error(`quote not in column-24${quoteEl.outerHTML}`);
    }

    const cells = [[...container.children]];

    createBlock(container, document, 'quote', cells);
  });
}

function columns(main, document) {
  main.querySelectorAll('.fifty-fifty_container')
    .forEach((container) => {
      const children = [...container.children];
      if (children.length !== 2) {
        throw new Error('fifty-fifty_container expected 2 children', container.outerHTML);
      }
      let columnElements = children;
      if (container.classList.contains('fifty-fifty_container--content-end')) {
        if (columnElements[0].classList.contains('fifty-fifty_content')) {
          columnElements = columnElements.reverse();
        }
      }

      createBlock(container, document, 'columns', [columnElements]);
    });
}

function mosaicReveal(main, document) {
  main.querySelectorAll('.mosaic-reveal > .mosaic-reveal > .mosaic-reveal_mosaics')
    .forEach((container) => {
      const cells = [...container.children]
        .map((mosaic) => {
          const imageUrl = mosaic.getAttribute('data-lazy-image');
          const backgroundImage = document.createElement('img');
          backgroundImage.src = imageUrl;
          const mosaicRevealContent = mosaic.querySelector(':scope > .mosaic-reveal_content');

          return [backgroundImage, mosaicRevealContent];
        });
      const parent = container.parentElement;

      createBlock(container, document, 'Mosaic reveal', cells);

      createBlock(parent, document, 'Section metadata', [['Style', 'Column section']]);
    });
}

function sections(main, document) {
  main.querySelectorAll('.aem-GridColumn:not(:last-child)')
    .forEach((container) => {
      const hr = document.createElement('hr');
      container.after(hr);
    });
}

function links(main, document) {
  main.querySelectorAll('calcite-link')
    .forEach((link) => {
      const a = document.createElement('a');
      const href = link.getAttribute('href');
      a.setAttribute('href', href);
      a.textContent = link.textContent;
      if (link.getAttribute('icon-end') === 'arrowRight') {
        a.textContent += ' :arrow-right:';
      }
      link.replaceWith(a);
    });
}

function localNavigation(main, document) {
  const container = document.querySelector('.local-navigation.aem-GridColumn');
  if (container) {
    createBlock(container, document, 'Local navigation', [['']]);
  }
}

function newsletter(main, document) {
  const newsletterContainer = document.querySelector('aside#side-drawer');
  if (newsletterContainer) {
    const newsletterIframeSrc = newsletterContainer.querySelector('iframe').getAttribute('data-src');
    const newsletterIframeUrl = `https://www.esri.com/${newsletterIframeSrc}`;
    const newsletterLink = document.createElement('a');
    newsletterLink.setAttribute('href', newsletterIframeUrl);
    newsletterLink.textContent = newsletterIframeUrl;

    main.append(WebImporter.Blocks.createBlock(document, {
      name: 'newsletter',
      cells: [[newsletterLink]],
    }));

    newsletterContainer.closest('.aem-GridColumn.experiencefragment').remove();
  }
}

// Function to find function calls and access the Nth parameter
function findFunctionCallAndParameter(ast, functionName, parameterIndex) {
  let result = null;
  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.name === functionName) {
        const args = path.node.arguments;
        if (args.length > parameterIndex) {
          console.log(`The ${parameterIndex + 1}th parameter of ${functionName} is:`, args[parameterIndex]);
          result = args[parameterIndex];
        } else {
          console.log(`${functionName} does not have ${parameterIndex + 1} parameters.`);
        }
      }
    },
  });

  return result;
}

function form(main, document) {
  const forms = main.querySelectorAll('.esri-one-form');
  forms.forEach((formContainer) => {
    const script = formContainer.querySelector('script:not([src])').textContent;
    /* Sample script content:
     window.__formsLoaded = window.__formsLoaded || {};

     if (!window.__formsLoaded['one-form-60e31ff3\u002D9b77\u002D4df5\u002Db701\u002D36a208216c26']) {
     window.initOneForm('one-form-60e31ff3\u002D9b77\u002D4df5\u002Db701\u002D36a208216c26', {
     divId: 'one-form-60e31ff3\u002D9b77\u002D4df5\u002Db701\u002D36a208216c26',
     aemFieldServiceBasePath: "\/content\/experience\u002Dfragments\/esri\u002Dsites\/en\u002Dus\/site\u002Dsettings\/one\u002Dform\u002Dadmin\/master",
     aemEditMode: 'false',
     mode: "basic-progressive-form",
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
     disablePersonalization: '' === "true",
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
     showEventConsentCheckBoxes: '' === "true",
     marketingConsentRequired: '',
     marketingConsentRequiredMessage: '',
     customMarketingConsentLabel: '',
     customMarketingConsentRequiredMessage: '',
     customContactConsentLabel: '',
     customContactConsentRequiredMessage: '',
     thankyouPageUrl: '',
     thankyouPageParams: '',
     sendEmail: '' === "true",
     emailTo: '',
     emailCc: '',
     emailBcc: '',
     emailSubject: '',
     emailBody: '',
     });

     window.__formsLoaded['one-form-60e31ff3\u002D9b77\u002D4df5\u002Db701\u002D36a208216c26'] = true;
     }
     */

    const ast = parser.parse(script, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    const param = findFunctionCallAndParameter(ast, 'initOneForm', 1);

    // get the dictionary passed to initOneForm
    // const matches = script.match(/window.initOneForm\('one-form-[^']+', ({[^}]+})/);
    // eslint-disable-next-line no-eval
    // console.log(matches[1]);

    console.log('test', param);
  });

  return [];
}

function transformers(main, document, html, pathname) {
  const report = {
    icons: inlineIcons(main, html),
  };

  newsletter(main, document);
  createMetadata(main, document, pathname);
  videos(main, document);
  calciteButton(main, document);
  links(main, document);
  sections(main, document);
  hero(main, document);
  storyteller(main, document);
  tabs(main, document);
  mediaGallery(main, document);
  cards(main, document);
  callToAction(main, document);
  map(main, document, html);
  quote(main, document);
  columns(main, document);
  mosaicReveal(main, document);
  localNavigation(main, document);
  transformUrls(main);

  return report;
}

export default {
  preprocess: ({ document, url }) => {
    const main = document.querySelector('main');

    form(main, document);
  },
  transform: ({
    document, html, url,
  }) => {
    const main = document.querySelector('main');
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      '.disclaimer',
    ]);

    const { pathname } = new URL(url);

    const report = transformers(main, document, html, pathname);

    return [{
      element: main,
      path: pathname,
      report,
    }];
  },
};
