'use strict';

var request = require('request');
var moment = require('moment');
var _ = require('lodash');
var NodeCache = require('node-cache');
var conf = require('../conf.js');

conf.load();

var studyCache = new NodeCache({stdTTL: 119, checkperiod: 120}); //cache lives for 2 minutes

var getTextValueFromNumber = function getTextValueFromNumber(studyResponse, itemOID, itemValue) {
	var itemDefObject = _.find(studyResponse.Study.MetaDataVersion.ItemDef, {'@OID': itemOID});
	var codeListObject = _.find(studyResponse.Study.MetaDataVersion.CodeList, {'@OID': itemDefObject.CodeListRef['@CodeListOID']});
	var codeListItemObject = _.find(codeListObject.CodeListItem, {'@CodedValue': itemValue});
	return (codeListItemObject) ? codeListItemObject.Decode.TranslatedText : '';
};

var parseODC = function parseODC(body) {
	var result = [];
	var studyResponse = JSON.parse(body);
	for (var iSubject = 0; iSubject < studyResponse.ClinicalData.SubjectData.length; iSubject++) {
		var currentSubject = studyResponse.ClinicalData.SubjectData[iSubject];
		var momentDate =  moment(currentSubject.StudyEventData['@OpenClinica:StartDate'], 'D-MMM-YYYY').toDate();
		var date = moment(momentDate).format('YYYY-MM-DD');
		var name = '';
		var room = '';
		var concernCategory = '';
		var concernSeverity = '';
		var concernCategoryFilename = '';
		var concernSubcategories = [];
		var concernNarrative = '';
		var concernFirstOccurred = '';
		var concernShared = '';
		var concernPlanToShare = '';
		var familyEngaged = '';
		if (currentSubject.StudyEventData) {
			var currentStudyEvent = currentSubject.StudyEventData;
			if (Array.isArray(currentSubject.StudyEventData)) {
				currentStudyEvent = currentSubject.StudyEventData[0];
			}
			if (currentStudyEvent.FormData && currentStudyEvent.FormData.ItemGroupData) {
				for (var iItemGroup = 0; iItemGroup < currentStudyEvent.FormData.ItemGroupData.length; iItemGroup++) {
					var currentItemGroup = currentStudyEvent.FormData.ItemGroupData[iItemGroup];
					for (var iItem = 0; iItem < currentItemGroup.ItemData.length; iItem++) {
						var currentItem = currentItemGroup.ItemData[iItem];
						if (currentItem['@ItemOID'] === 'I_MSCMY_MSCNAME') {
							name = currentItem['@Value'];
						} else if (currentItem['@ItemOID'] === 'I_MSCMY_MSCROOM') {
							room = currentItem['@Value'];
						} else if (currentItem['@ItemOID'] === 'I_MSCMY_MSCFAMILYCARE') {
							familyEngaged = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
						}
					}
				}
				var concerns = [];
				var concernGroupArray = _.filter(currentStudyEvent.FormData.ItemGroupData, {'@ItemGroupOID': 'IG_MSCMY_MSC3'});
				for (var iConcernGroup = 0; iConcernGroup < concernGroupArray.length; iConcernGroup++) {
					currentItemGroup = concernGroupArray[iConcernGroup];
					for (iItem = 0; iItem < currentItemGroup.ItemData.length; iItem++) {
						var currentItem = currentItemGroup.ItemData[iItem];
						if (currentItem['@ItemOID'] === 'I_MSCMY_MSCCONCERN') {
							concernCategory = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']).replace(/concern/gi, '').replace(/My /gi, '');
							concernCategory = _.capitalize(concernCategory);
							concernCategoryFilename = concernCategory.toLowerCase().replace(/\s+/g, '');
							concernCategoryFilename = concernCategory.toLowerCase().replace(/\s+/g, '');
						} else if (currentItem['@ItemOID'] === 'I_MSCMY_MSCSEVERITY') {
							concernSeverity = currentItem['@Value'];
						} else if (currentItem['@ItemOID'] === 'I_MSCMY_MSCSUBCONCERNS') {
							concernSubcategories = [];
							if (currentItem['@Value'].length > 0) {
								var subcategoryArray = [];
								if (currentItem['@Value'].indexOf(',') > -1) {
									subcategoryArray = currentItem['@Value'].split(',');
								} else {
									subcategoryArray.push(currentItem['@Value']);
								}
								for (var iSubcategory = 0; iSubcategory < subcategoryArray.length; iSubcategory++) {
									var multiSelectListObject = studyResponse.Study.MetaDataVersion['OpenClinica:MultiSelectList'][0];
									var multiSelectListItemObject = _.find(multiSelectListObject['OpenClinica:MultiSelectListItem'], {'@CodedOptionValue': subcategoryArray[iSubcategory]});
									if (multiSelectListItemObject) {
										concernSubcategories.push(multiSelectListItemObject.Decode.TranslatedText);
									}
								}
							}
						} else if (currentItem['@ItemOID'] === 'I_MSCMY_MSCNARR') {
							concernNarrative = currentItem['@Value'];
						} else if (currentItem['@ItemOID'] === 'I_MSCMY_MSCFIRST') {
							concernFirstOccurred = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
						} else if (currentItem['@ItemOID'] === 'I_MSCMY_MSCSHARED') {
							concernShared = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
						} else if (currentItem['@ItemOID'] === 'I_MSCMY_MSCPLANTOSHARE') {
							concernPlanToShare = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
						}
					}
					concerns.push({
						category: concernCategory,
						severity: parseInt(concernSeverity),
						categoryFilename: concernCategoryFilename,
						subcategories: concernSubcategories,
						narrative: concernNarrative,
						firstOccurred: concernFirstOccurred,
						shared: concernShared,
						planToShare: concernPlanToShare
					});
				}
				result[iSubject] = {
					date: date,
					name: name,
					room: room,
					concerns: concerns,
					familyEngaged: familyEngaged
				};
			}
		}
	}
	result = _.sortByOrder(result, ['date', 'concernLevel'], [false, false]);
	return result;
};

var getStudy = function(studyId, cb) {
	var cachedResult = studyCache.get(studyId);
	if (cachedResult === undefined) {
		request.get(conf.get('restUrl') + studyId + '/*/*/*', function requestStudy(error, response, body) {
			if (!error && response.statusCode === 200) {
				var result = [];
				result = parseODC(body);
				studyCache.set(studyId, result);
				cb(result);
			}
			else {
				console.log(error);
			}
		});
	} else {
		cb(cachedResult);
	}
};

module.exports = {
	get: getStudy
};
