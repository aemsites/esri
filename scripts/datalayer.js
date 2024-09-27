"use strict";
var SlingSettingsService = Packages.org.apache.sling.settings.SlingSettingsService;
use(function () {
    var pageTitle = currentPage.title;
    var pageName = "";
    var pagePath = currentPage.path;
    var resourceType = currentPage.properties.get("sling:resourceType");
    var template = currentPage.properties.get("cq:template");
    var pageTags = currentPage.properties.get("cq:tags");
	  var hideBreadcrumb = currentPage.properties.get("hideBreadcrumb");
    var language = request.locale.language;
    var country = request.locale.country;
    var hierarchy1 = "", hierarchy2 = "", hierarchy3 = "", hierarchy4 = "";
    var typeTags = currentPage.properties.get("pagetype");
    var subTypeTags = currentPage.properties.get("pagesubtype");
    var sectors = currentPage.properties.get("sectors");
    var events = currentPage.properties.get("events");
    var products = currentPage.properties.get("products");
    var programCampaign = currentPage.properties.get("programCampaign");
    var businessObjective = currentPage.properties.get("businessObjective");
    var parentPage = currentPage.getParent();
    var tabs = [];
    var questionsList = [];
    var totalTabs = 0;
    var reversePageStruct = [];
    while (checkIfValidPage(parentPage)) {
        reversePageStruct.push('' + parentPage.getTitle());
        parentPage = parentPage.getParent();
    }
    reversePageStruct.reverse().splice(4);
    var pageHierarchy = [];
    for (var j = 0; j < reversePageStruct.length; j++) {
        pageHierarchy.push(titleCase('' + reversePageStruct[j]));
    }
    var parseLocale = "";
    if (pagePath.indexOf("/content/esri-sites/") != -1 || pagePath.indexOf("/content/distributor-sites/") != -1 || pagePath.indexOf("/content/support/") != -1) {
        if (pagePath.indexOf("/content/esri-sites/") != -1) {
            parseLocale = pagePath.substr("/content/esri-sites/".length);
        } else if (pagePath.indexOf("/content/distributor-sites/") != -1) {
            parseLocale = pagePath.substr("/content/distributor-sites/".length);
            if (parseLocale.indexOf("/") != -1) {
                parseLocale = parseLocale.substr(parseLocale.indexOf("/") + 1);
            }
        }else if (pagePath.indexOf("/content/support/") != -1) {
            parseLocale = pagePath.substr("/content/support/".length);
        }
        if (parseLocale.indexOf("/") != -1) {
            parseLocale = parseLocale.substr(0, parseLocale.indexOf("/"));
            if (!/^[a-z]{2}[-]{1}[a-zA-Z]{2}$/.test(parseLocale)) {
                parseLocale = "";
            } else {
                language = parseLocale.substr(0, 2);
                country = parseLocale.substr(3);
            }
        } else {
            if (!/^[a-z]{2}[-]{1}[a-zA-Z]{2}$/.test(parseLocale)) {
                parseLocale = "";
            } else {
                language = parseLocale.substr(0, 2);
                country = parseLocale.substr(3);
            }
        }
    }
    if (parseLocale == "") {
        parseLocale = request.locale.toString();
    }
    if (pageHierarchy[0]) hierarchy1 = pageHierarchy[0];
    if (pageHierarchy[1]) hierarchy2 = pageHierarchy[1];
    if (pageHierarchy[2]) hierarchy3 = pageHierarchy[2];
    if (pageHierarchy[3]) hierarchy4 = pageHierarchy[3];
    var returnTags = [];
	var resourceResolver = resource.getResourceResolver();
	var tagManager = resourceResolver.adaptTo(Packages.com.day.cq.tagging.TagManager);
    var nodeObj = currentPage.adaptTo(Packages.javax.jcr.Node);
    var createdProperty= nodeObj.getProperty("jcr:created");
    var createdByDate;
    if(null!=createdProperty && null != createdProperty.getValue()){
        createdByDate=getFormatedDate(createdProperty);
    }
	if (pageTags) {
		for (var i = 0; i < pageTags.length; i++) {
			var tags = readTags(tagManager, resourceResolver, pageTags[i]);
			for (var t = 0; t < tags.length; t++) {
				returnTags.push(tags[t]);
			}
		}
	}
   var pageTypeTags;
    	if(null!=typeTags && typeTags.length >=1){
        for (var i = 0; i < typeTags.length; i++) {
		pageTypeTags = readTags(tagManager, resourceResolver, typeTags[i]);
		}
    }else if(null!=typeTags){
		pageTypeTags = readTags(tagManager, resourceResolver, typeTags);
    }
	var pageSubTypeTags;
		if(null!=subTypeTags && subTypeTags.length >=1){
        for (var i = 0; i < subTypeTags.length; i++) {
		pageSubTypeTags = readTags(tagManager, resourceResolver, subTypeTags[i]);
		}
    }else if(null!=subTypeTags){
		pageSubTypeTags = readTags(tagManager, resourceResolver, subTypeTags);
    }
    if (pageHierarchy.length > 0) {
        pageName = pageHierarchy.join(':') + ':' + titleCase(pageTitle);
    } else {
        pageName = titleCase(pageTitle);
    }

	if (currentNode.hasNode("items")) {

        var items = currentNode.getNode("items");
        if (items.hasNodes()) {
            var tabid = 0;
            for (var child in items.getChildren()) {
                tabid++;
                totalTabs++;
                var childNode = items.getNode(child);
                var props = childNode.getProperties();

	                tabs.push({
						contactOption: props.contactOption != null ? getOGMetaTags(props.contactOption.getString(),"contactOption"): "",
                        contactType: props.contactType != null ? getOGMetaTags(props.contactType.getString(),"contactType"): "",
                       	telephone: props.telephone != null ? getOGMetaTags(props.telephone.getString(),"telephone"): "",
						type: props.type != null ? getOGMetaTags(props.type.getString(),"telephone"): "",
	                });
            }
        }
    }

    if (currentNode.hasNode("faqitems")) {
        var items = currentNode.getNode("faqitems");
        if (items.hasNodes()) {
            var tabid = 0;
            for (var child in items.getChildren()) {
                tabid++;
                totalTabs++;
                var childNode = items.getNode(child);
                var props = childNode.getProperties();
                var questionString = new String(props.faqQuestion).replace(/"/g, "'");
 				var answerString = new String(props.faqAnswer).replace(/"/g, "'");

	                questionsList.push({
						question: props.faqQuestion != null ? getOGMetaTags(questionString,"faqQuestion"): "",
                        answer: props.faqAnswer != null ? getOGMetaTags(answerString,"faqAnswer"): "",
	                });
            }
        }
    }


    var runmodesArr = [];
    var runmodesSet = sling.getService(SlingSettingsService).getRunModes();
    var iterator = runmodesSet.iterator();
    while (iterator.hasNext()) {
        runmodesArr.push(iterator.next());
    }
    var isDistributor = pagePath.contains('distributor-sites') ? true : null;
    var breadcrumb = [];
	var pageParent = currentPage;
	if(!hideBreadcrumb){
        while (pageParent != null){
            if(isParentAboveLangaugeNode(pageParent)){
				var isBreadCrumbDissabled=pageParent.properties.get("hideBreadcrumb");
				if(isBreadCrumbDissabled){
					hideBreadcrumb=isBreadCrumbDissabled;
					breadcrumb = [];
					break;
				}
				var redirectpath=pageParent.properties.get("cq:redirectTarget","");
				 var jsonData = {};
                jsonData.pageName=pageParent.properties.get("navTitle") ? pageParent.properties.get("navTitle") : pageParent.properties.get("jcr:title");
			if(null != redirectpath && redirectpath!= "" ){
				jsonData.pagePath=redirectpath;
			}else{
				jsonData.pageName=pageParent.properties.get("navTitle") ? pageParent.properties.get("navTitle") : pageParent.properties.get("jcr:title");
				jsonData.pagePath=pageParent.getPath();
			}
		breadcrumb.push(jsonData);
        pageParent = pageParent.getParent();
    }else{
        break;
    }
      }
    }

    var authCookie = request.getCookie("esri_auth");
    var isloggedIn = false;
    if(authCookie !=null){
        isloggedIn = true;
    }


    let modifiedReturnTags = [];
    let keys={};
    for(var i = 0; i < returnTags.length; i++){
        let strHldr =returnTags[i].split(":");
        if(!!keys[strHldr[0]]){
            keys[strHldr[0]] = keys[strHldr[0]] + "|" + strHldr[1];
        }else{
            keys[strHldr[0]] = returnTags[i];
        }
    }
    for (let key in keys){
        modifiedReturnTags.push(keys[key]);
    }

    return {
        pageTitle: titleCase(pageTitle),
        pageName: pageName,
        pagePath: pagePath,
        pageType: pageTypeTags,
        pageSubType: pageSubTypeTags,
        sectors: sectors,
        events: events,
        products: products,
        programCampaign : programCampaign,
        businessObjective: businessObjective,
        hierarchy1: hierarchy1,
        hierarchy2: hierarchy2,
        hierarchy3: hierarchy3,
        hierarchy4: hierarchy4,
        environment: runmodesArr,
        locale: parseLocale,
        resourceType: resourceType,
        template: template,
        language: language,
        country: country,
        tags: modifiedReturnTags,
        tabs: tabs,
        questionsList: questionsList,
        isloggedIn : isloggedIn,
        isDistributor: isDistributor,
        corporationName : getOGMetaTags(currentPage.properties.get("corpName"),"corpName"),
        corporationLegalName : getOGMetaTags(currentPage.properties.get("corpLegalName"),"corpLegalName"),
        corporationLogo : getOGMetaTags(currentPage.properties.get("corpLogo"),"corpLogo"),
		corporationImage : getOGMetaTags(currentPage.properties.get("corpImage"),"corpImage"),
        corporationDescription : getOGMetaTags(currentPage.properties.get("corpDescription"),"corpDescription"),
    	corporationAlternateName : getOGMetaTags (currentPage.properties.get("corpAlternateName"),"corpAlternateName"),
    	corporationBrand : getOGMetaTags (currentPage.properties.get("corpBrand"),"corpBrand"),
		corporationAddType : getOGMetaTags(currentPage.properties.get("corpAddType"),"corpAddType"),
        corporationAddCountry : getOGMetaTags(currentPage.properties.get("corpAddCountry"),"corpAddCountry"),
    	corporationAddLocality : getOGMetaTags(currentPage.properties.get("corpAddLocality"),"corpAddLocality"),
    	corporationAddRegion : getOGMetaTags(currentPage.properties.get("corpAddRegion"),"corpAddRegion"),
    	corporationAddPostalCode : getOGMetaTags(currentPage.properties.get("corpPostalCode"),"corpPostalCode"),
		corporationAddStreetAddress : getOGMetaTags(currentPage.properties.get("corpStreetAddress"),"corpStreetAddress"),
        corporationTelephone : getOGMetaTags(currentPage.properties.get("telephone"),"telephone"),
        corporationContactType : getOGMetaTags(currentPage.properties.get("contactType"),"contactType"),
        corporationContactOption : getOGMetaTags(currentPage.properties.get("contactOption"),"contactOption"),
        corporationSameAs : getOGMetaTags(currentPage.properties.get("corpSameAs"),"corpSameAs"),
    	softwareCorporationName : getOGMetaTags(currentPage.properties.get("sftName"),"sftName"),
        softwareCategory : getOGMetaTags(currentPage.properties.get("sftCategory"),"sftCategory"),
        softwareSuite : getOGMetaTags(currentPage.properties.get("sftSuite"),"sftSuite"),
        softwareImage : getOGMetaTags(currentPage.properties.get("sftImage"),"sftImage"),
    	softwareProviderName : getOGMetaTags(currentPage.properties.get("sftProviderName"),"sftProviderName"),
     	webPageSourceName : getOGMetaTags(currentPage.properties.get("webPageName"),"webPageName"),
        webPageImage : getOGMetaTags(currentPage.properties.get("webImage"),"webImage"),
    	businessName : getOGMetaTags(currentPage.properties.get("businessName"),"businessName"),
     	businessOrganizerName : getOGMetaTags(currentPage.properties.get("busniessOrgName"),"busniessOrgName"),
        businessImage : getOGMetaTags(currentPage.properties.get("businessImage"),"businessImage"),
        businessDescription : getOGMetaTags(currentPage.properties.get("jcr:description"),"jcr:description"),
        businessLocationName : getOGMetaTags(currentPage.properties.get("businessLocationName"),"businessLocationName"),
      	businessAddCountry : getOGMetaTags(currentPage.properties.get("businessAddCountry"),"businessAddCountry"),
    	businessAddLocality : getOGMetaTags(currentPage.properties.get("businessAddLocality"),"businessAddLocality"),
    	businessAddRegion : getOGMetaTags(currentPage.properties.get("businessAddRegion"),"businessAddRegion"),
    	businessAddPostalCode : getOGMetaTags(currentPage.properties.get("businessPostalCode"),"businessPostalCode"),
		businessAddStreetAddress : getOGMetaTags(currentPage.properties.get("businessStreetAddress"),"businessStreetAddress"),
        businessStartDate : getOGMetaTags(currentPage.properties.get("businessStartDate"),"businessStartDate"),
        businessEndDate : getOGMetaTags(currentPage.properties.get("businessEndDate"),"businessEndDate"),
        faqQuestion1 : getOGMetaTags(currentPage.properties.get("faqQuestion1"),"faqQuestion1"),
        faqAnswer1 : getOGMetaTags(currentPage.properties.get("faqAnswer1"),"faqAnswer1"),
        faqQuestion2 : getOGMetaTags(currentPage.properties.get("faqQuestion2"),"faqQuestion2"),
        faqAnswer2 : getOGMetaTags(currentPage.properties.get("faqAnswer2"),"faqAnswer2"),
        faqQuestion3 : getOGMetaTags(currentPage.properties.get("faqQuestion3"),"faqQuestion3"),
        faqAnswer3 : getOGMetaTags(currentPage.properties.get("faqAnswer3"),"faqAnswer3"),
        faqQuestion4 : getOGMetaTags(currentPage.properties.get("faqQuestion4"),"faqQuestion4"),
        faqAnswer4 : getOGMetaTags(currentPage.properties.get("faqAnswer4"),"faqAnswer4"),
        faqQuestion5 : getOGMetaTags(currentPage.properties.get("faqQuestion5"),"faqQuestion5"),
        faqAnswer5 : getOGMetaTags(currentPage.properties.get("faqAnswer5"),"faqAnswer5"),
        twitterAccountName: getOGMetaTags(currentPage.properties.get("twitterName"), "twitterName"),
        facebookAppId: getOGMetaTags(currentPage.properties.get("fbId"), "fbId"),
        breadcrumbString: getBreadscrumbString(breadcrumb,hideBreadcrumb),
        authorizationRequired : getOGMetaTags(currentPage.properties.get("favicauthorizationRequiredonPath"), "authorizationRequired"),
        eventKey : getOGMetaTags(currentPage.properties.get("eventKey"), "eventKey"),
        source : getOGMetaTags(currentPage.properties.get("source"), "source"),
        registrationPath : getOGMetaTags(currentPage.properties.get("registrationPath"), "registrationPath"),
        IncompleteregistrationPath : getOGMetaTags(currentPage.properties.get("IncompleteregistrationPath"), "IncompleteregistrationPath"),
        calciteConfiguration : getOGMetaTags(currentPage.properties.get("calciteConfiguration"), "calciteConfiguration"),
        designTheme : validateDesignTheme(currentPage.properties.get("designThemes")),
        darkDesignTheme : validateDesignTheme(currentPage.properties.get("designThemeDark")),
        secondarydesignTheme : validateDesignTheme(currentPage.properties.get("secondarydesignThemes")),
        secondarydarkDesignTheme : validateDesignTheme(currentPage.properties.get("secondarydesignThemeDark")),
        calciteVersion : validateCalciteVersion(getOGMetaTags(currentPage.properties.get("calciteConfiguration"), "calciteConfiguration")),
        pageCreated: createdByDate
    };
});

/**
 * Checks if the given page is a valid page based on specific criteria.
 *
 * @param {Object} parentPage - The page object to be checked.
 * @param {string} parentPage.getName - Function to get the name of the page.
 * @param {Object} parentPage.getParent - Function to get the parent page object.
 * @returns {boolean} - Returns true if the page is valid, otherwise false.
 */
function checkIfValidPage(parentPage){
	if(parentPage != null &&
        (parentPage.getName() != "esri-sites" && parentPage.getName() != "distributor-sites" && parentPage.getName() != "gis-day" && parentPage.getName() != "support") &&
        parentPage.getParent() &&
        (parentPage.getParent().getName() != "esri-sites" || parentPage.getParent().getName() != "distributor-sites" || parentPage.getParent().getName() != "gis-day" || parentPage.getParent().getName() != "support") &&
        !parentPage.getName().match(/^[a-z]{2}[\-]{1}[a-zA-Z]{2}$/)){
			return true;
		}
		return false;
}

/**
 * Checks if the given parent page is above the language node in the hierarchy.
 *
 * This function verifies if the provided parent page is valid and not named "language-masters" or "en".
 * Additionally, it checks if the parent of the provided parent page is not named "language-masters".
 *
 * @param {Object} parentPage - The parent page to check.
 * @returns {boolean} - Returns true if the parent page is above the language node, otherwise false.
 */
function isParentAboveLangaugeNode(parentPage){
	if((checkIfValidPage(parentPage)&& parentPage.getName() != "language-masters"  && parentPage.getName() != "en") && parentPage.getParent().getName() != "language-masters" ){
		  return true;
		}
		return false;
}

/**
 * Generates a breadcrumb string in JSON-LD format.
 *
 * @param {Array} breadcrumb - An array of breadcrumb objects, each containing `pageName` and `pagePath` properties.
 * @param {boolean} hideBreadcrumb - A flag indicating whether to hide the breadcrumb.
 * @returns {string} A JSON-LD formatted string representing the breadcrumb trail.
 */
function getBreadscrumbString(breadcrumb,hideBreadcrumb) {
     var breadcrumbValue = '';
    if (breadcrumb != null && !hideBreadcrumb && breadcrumb.length > 0 ){
         breadcrumbValue +='[';
		 var position =1;
        for(var i = breadcrumb.length - 1; i >=0 ; i--) {
             breadcrumbValue += '{';
			 breadcrumbValue += '"@type": "ListItem",';
			 breadcrumbValue +='"position": '+ position +',';
                breadcrumbValue += '"name":"' + breadcrumb[i].pageName +'",';
            var fullPath=breadcrumb[i].pagePath + "";
            var absolutePath = resolver.map(fullPath);
            breadcrumbValue += '"item":"' +absolutePath +'"';
            breadcrumbValue += '}';
			if(i>0){
				 breadcrumbValue += ',';
			}
			position=position+1;
          }
        breadcrumbValue +=']';
        return breadcrumbValue;
    } else {
        return breadcrumbValue;
    }
}

/**
 * Converts a given string to title case.
 * Title case means the first letter of each word is capitalized and the rest are in lowercase.
 *
 * @param {string} titleStr - The string to be converted to title case.
 * @returns {string} The converted string in title case. If the input is null, an empty string is returned.
 */
function titleCase(titleStr) {
    if (titleStr != null) {
        var splitStr = titleStr.replace('-', ' ').replace('   ', ' ').replace('  ', ' ').toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].substring(0, 1).toUpperCase() + splitStr[i].substring(1);
        }
        var formattedStr = splitStr.join(' ');
        return formattedStr;
    } else {
        return "";
    }
}

/**
 * Retrieves the Open Graph meta tag value for a given property name.
 * If the meta tag is not found on the current page, it traverses up the parent pages
 * until it finds the meta tag or reaches a specified root page.
 *
 * @param {string|null} ogMetaTag - The initial Open Graph meta tag value. If null, the function will search for the value.
 * @param {string} propName - The property name of the Open Graph meta tag to retrieve.
 * @returns {string|null} - The value of the Open Graph meta tag, or null if not found.
 */
function getOGMetaTags(ogMetaTag, propName) {
    if (ogMetaTag == null) {
        var parentMetaTagPage = currentPage.getParent();
        while (ogMetaTag == null && parentMetaTagPage != null && (parentMetaTagPage.getName() != "esri-sites" && parentMetaTagPage.getName() != "distributor-sites" && parentMetaTagPage.getName() != "gis-day" && parentMetaTagPage.getName() != "support")) {
            ogMetaTag = parentMetaTagPage.properties.get(propName);
            parentMetaTagPage = parentMetaTagPage.getParent();
        }
    }
    return ogMetaTag;
}

/**
 * Reads tags from the tag manager and resource resolver.
 *
 * @param {Object} tagManager - The tag manager to resolve tags.
 * @param {Object} resourceResolver - The resource resolver to get resources.
 * @param {string} tag - The tag to be resolved.
 * @returns {Array<string>} An array of tags. If the tag has the "cq:backlinks" property,
 *                          the tag ID is returned; otherwise, the original tag is returned.
 */
function readTags(tagManager, resourceResolver, tag) {
	var returnTags = [];
	var tagObj = tagManager.resolve(tag);
	if (tagObj != null) {
		var node = resourceResolver.getResource(tagObj.getPath()).adaptTo(
				Packages.javax.jcr.Node);
		if (node.hasProperty("cq:backlinks")) {
			var currentTag = tagObj.getTagID();
			returnTags.push(currentTag);
		} else {
			returnTags.push(tag);
		}
	}
	return returnTags;
}

/**
 * Formats a given JCR date to "MM/dd/yyyy" format in PST timezone.
 *
 * @param {Object} jcrDate - The JCR date object containing the date to be formatted.
 * @returns {string} The formatted date string in "MM/dd/yyyy" format.
 */
function getFormatedDate(jcrDate){
    var formattedDate = new java.text.SimpleDateFormat("MM/dd/yyyy");
   formattedDate.setTimeZone(java.util.TimeZone.getTimeZone("PST"));
    return formattedDate.format(new java.util.Date(jcrDate.getLong()));
}

/**
 * Validates and updates the design theme string.
 *
 * This function checks if the provided design theme string starts with a
 * hash (#). If it does, it returns the string as is. If it does not, it
 * prepends a hash (#) to the string. If the input is null, it returns a
 * default theme color of '#0079c1'.
 *
 * @param {string|null} designTheme - The design theme string to validate.
 * @returns {string} - The validated and updated design theme string.
 */
function validateDesignTheme (designTheme){
    var updatedTheme = '';
    if(designTheme != null ){
        if (designTheme.startsWith("#")){
			updatedTheme = designTheme;
        }else {
			updatedTheme = '#' + designTheme;
        }
    }else {
        updatedTheme = '#0079c1';
    }
    return updatedTheme;
}

/**
 * Validates and formats the Calcite version URL.
 *
 * @param {string|null} calciteVersion - The Calcite version URL to validate.
 * @returns {string} - The validated and formatted Calcite version URL. If the input is null, returns the default URL 'https://js.arcgis.com/calcite-components/1.4.2'.
 */
function validateCalciteVersion (calciteVersion) {
    var calciteVer = '';
    if (calciteVersion != null) {
        var checkStr = calciteVersion.slice(-1);
        if (checkStr == '/') {
            calciteVer = calciteVersion.slice(0, -1);
        } else {
            calciteVer = calciteVersion;
        }
    } else {
        calciteVer = 'https://js.arcgis.com/calcite-components/1.4.2'
    }
    return calciteVer;
}
