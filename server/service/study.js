'use strict';

var request = require('request');
var moment = require('moment');
var _ = require('lodash');
var conf = require('../conf.js');

conf.load();

var getTextValueFromNumber = function getTextValueFromNumber(studyResponse, itemOID, itemValue) {
	var itemDefObject = _.find(studyResponse.Study.MetaDataVersion.ItemDef, {'@OID': itemOID});
	var codeListObject = _.find(studyResponse.Study.MetaDataVersion.CodeList, {'@OID': itemDefObject.CodeListRef['@CodeListOID']});
	var codeListItemObject = _.find(codeListObject.CodeListItem, {'@CodedValue': itemValue});
	return (codeListItemObject) ? codeListItemObject.Decode.TranslatedText : '';
};

module.exports = {
	get: function getStudy(studyId, cb) {
		request.get(conf.get('restUrl') + studyId + '/*/*/*', function requestStudy(error, response, body) {
			if (!error && response.statusCode === 200) {
				var result = [];
				var studyResponse = JSON.parse(body);
				for (var iSubject = 0; iSubject < studyResponse.ClinicalData.SubjectData.length; iSubject++) {
					var currentSubject = studyResponse.ClinicalData.SubjectData[iSubject];
					var momentDate =  moment(currentSubject.StudyEventData['@OpenClinica:StartDate'], 'D-MMM-YYYY').toDate();
					var date = moment(momentDate).format('YYYY-MM-DD');
					var name = '';
					var room = '';
					var concernLevel = '';
					var concernCategory = '';
					var concernSubcategories = '';
					var concernNarrative = '';
					var firstOccurred = '';
					var sharedConcern = '';
					var planToShare = '';
					var familyEngaged = '';
					var currentStudyEvent = currentSubject.StudyEventData;
					if (Array.isArray(currentSubject.StudyEventData)) {
						currentStudyEvent = currentSubject.StudyEventData[0];
					}
					for (var iItemGroup = 0; iItemGroup < currentStudyEvent.FormData.ItemGroupData.length; iItemGroup++) {
						var currentItemGroup = currentStudyEvent.FormData.ItemGroupData[iItemGroup];
						for (var iItem = 0; iItem < currentItemGroup.ItemData.length; iItem++) {
							var currentItem = currentItemGroup.ItemData[iItem];
							if (currentItem['@ItemOID'] === 'I_MYSAF_PANAME') {
								name = currentItem['@Value'];
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_PAROOM') {
								room = currentItem['@Value'];
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_PASAFE4') {
								concernLevel = currentItem['@Value'];
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_PACON') {
								firstOccurred = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_PASHARE') {
								sharedConcern = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_PAPTS') {
								planToShare = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_PACENGA') {
								familyEngaged = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
							}
						}
					}
					var concernGroupArray = _.filter(currentStudyEvent.FormData.ItemGroupData, {'@ItemGroupOID': 'IG_MYSAF_PA_CON'});
					var concernGroupString = '';
					for (var iConcernGroup = 0; iConcernGroup < concernGroupArray.length; iConcernGroup++) {
						currentItemGroup = concernGroupArray[iConcernGroup];
						if (concernGroupString.length > 0) {
							concernGroupString += ' - ';
						}
						var subcategoryString;
						for (iItem = 0; iItem < currentItemGroup.ItemData.length; iItem++) {
							var currentItem = currentItemGroup.ItemData[iItem];
							if (currentItem['@ItemOID'] === 'I_MYSAF_PACONCAT') {
								concernCategory = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_PAPOFC') {
								if (currentItem['@Value'].length > 0) {
									var subcategoryArray = [];
									if (currentItem['@Value'].indexOf(',') > -1) {
										subcategoryArray = currentItem['@Value'].split(',');
									} else {
										subcategoryArray.push(currentItem['@Value']);
									}
									subcategoryString = '';
									for (var iSubcategory = 0; iSubcategory < subcategoryArray.length; iSubcategory++) {
										if (subcategoryString.length === 0) {
											subcategoryString += '(';
										}
										var multiSelectListObject = studyResponse.Study.MetaDataVersion['OpenClinica:MultiSelectList'];
										var multiSelectListItemObject = _.find(multiSelectListObject['OpenClinica:MultiSelectListItem'], {'@CodedOptionValue': subcategoryArray[iSubcategory]});
										if (subcategoryString.charAt(subcategoryString.length - 1) !== '(' && multiSelectListItemObject) {
											subcategoryString += ', ';
										}
										subcategoryString += (multiSelectListItemObject) ? multiSelectListItemObject.Decode.TranslatedText : '';
									}
									if (subcategoryString.length > 0) {
										subcategoryString += ')';
									}
								}
								concernSubcategories = currentItem['@Value'];
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_PAIYOW8') {
								concernNarrative = currentItem['@Value'];
							}
						}
						concernGroupString += concernCategory + ' ' + subcategoryString + ': ' + concernNarrative + ' ';
					}
					result[iSubject] = {
						date: date,
						name: name,
						room: room,
						concernLevel: parseInt(concernLevel),
						concerns: concernGroupString,
						firstOccurred: firstOccurred,
						sharedConcern: sharedConcern,
						planToShare: planToShare,
						familyEngaged: familyEngaged
					};
				}
				result = _.sortByOrder(result, ['date', 'concernLevel'], [false, false]);
				cb(result);
			}
			else {
				console.log(error);
			}
		});
	}
};
