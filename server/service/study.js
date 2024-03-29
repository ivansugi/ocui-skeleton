'use strict';

var request = require('request');
var moment = require('moment');
var _ = require('lodash');
var NodeCache = require('node-cache');
var conf = require('../conf.js');
var httpClient = require('../service/httpClient.js');
var localStorage = require('localStorage');
conf.load();

var studyCache = new NodeCache({stdTTL: 119, checkperiod: 120}); //cache lives for 2 minutes

var getTextValueFromNumber = function getTextValueFromNumber(studyResponse, itemOID, itemValue) {
	var itemDefObject = _.find(studyResponse.Study.MetaDataVersion.ItemDef, {'@OID': itemOID});
	var codeListObject = _.find(studyResponse.Study.MetaDataVersion.CodeList, {'@OID': itemDefObject.CodeListRef['@CodeListOID']});
	var codeListItemObject = _.find(codeListObject.CodeListItem, {'@CodedValue': itemValue});
	return (codeListItemObject) ? codeListItemObject.Decode.TranslatedText : '';
};

var parseODM = function parseODM(body) {
	var result = [];
	try {
		var studyResponse = JSON.parse(body);
		console.log("parseODM", studyResponse);
		var init = [];
		console.log("SubjectData length", objLength(studyResponse.ClinicalData.SubjectData));
		if (typeof studyResponse.ClinicalData.SubjectData.length === "undefined") {
			init[0] = studyResponse.ClinicalData.SubjectData;
		} else 
		{

			init = studyResponse.ClinicalData.SubjectData;
		}
		console.log("init", init);
		for (var iSubject = 0; iSubject < init.length; iSubject++) {

			var currentSubject= init[iSubject];
			/*
			if (objLength(studyResponse.ClinicalData.SubjectData) > 1){ 
				currentSubject= studyResponse.ClinicalData.SubjectData[iSubject];
			} else {
				currentSubject= studyResponse.ClinicalData.SubjectData;

			}*/
			console.log("inside for", currentSubject);
			var date = moment(currentSubject.StudyEventData['@OpenClinica:StartDate'], 'D-MMM-YYYY').toDate();
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
			var patientRelationship = '';
			var status = '1:New';
			var followups = [];
			var metadata = {};
			if (currentSubject.StudyEventData) {
				var currentStudyEvent = currentSubject.StudyEventData;
				if (Array.isArray(currentSubject.StudyEventData)) {
					currentStudyEvent = currentSubject.StudyEventData[0];
				}

				// metadata
				metadata.studySubjectOID = currentSubject['@SubjectKey'];
				metadata.studyEventOID = currentStudyEvent['@StudyEventOID'];
				console.log(metadata);


				// follow up
				if (currentStudyEvent['OpenClinica:DiscrepancyNotes']) {
					var currentDiscrepancyNotes = currentStudyEvent['OpenClinica:DiscrepancyNotes']['OpenClinica:DiscrepancyNote'];
					status = currentDiscrepancyNotes['@Status'];
					if (status === 'Updated' || status === 'New') {
						status = '2:In progress';
					} else if (status === 'Closed') {
						status = '3:Closed';
					}
					followups = [];
					var currentChildNote;
					if (Array.isArray(currentDiscrepancyNotes['OpenClinica:ChildNote'])) {
						currentDiscrepancyNotes['OpenClinica:ChildNote'] = _.sortByOrder(currentDiscrepancyNotes['OpenClinica:ChildNote'], ['@ID'], [false]);
						for (var iChildNotes = 0; iChildNotes < currentDiscrepancyNotes['OpenClinica:ChildNote'].length; iChildNotes++) {
							currentChildNote = currentDiscrepancyNotes['OpenClinica:ChildNote'][iChildNotes];
							followups.push({
								parentId: currentDiscrepancyNotes['@ID'],
								id: iChildNotes,
								staff: currentChildNote['@UserName'],
								date: moment(currentChildNote['@DateCreated'], 'D-MMM-YYYY').toDate(),
								note: currentChildNote['OpenClinica:DetailedNote']
							});
						}
					} else {
						currentChildNote = currentDiscrepancyNotes['OpenClinica:ChildNote'];
						followups.push({
							parentId: currentDiscrepancyNotes['@ID'],
							id: 0,
							staff: currentChildNote['@UserName'],
							date: moment(currentChildNote['@DateCreated'], 'D-MMM-YYYY').toDate(),
							note: currentChildNote['OpenClinica:DetailedNote']
						});
					}
				}
				// form data
				if (currentStudyEvent.FormData && currentStudyEvent.FormData.ItemGroupData) {
					var currentItemGroup;
					var currentItem;
					var iItemGroup;
					var iItem;
					for (iItemGroup = 0; iItemGroup < currentStudyEvent.FormData.ItemGroupData.length; iItemGroup++) {
						currentItemGroup = currentStudyEvent.FormData.ItemGroupData[iItemGroup];
						for (iItem = 0; iItem < currentItemGroup.ItemData.length; iItem++) {
							currentItem = currentItemGroup.ItemData[iItem];
							if (currentItem['@ItemOID'] === 'I_MYSAF_WHAT_NAME') {
								name = currentItem['@Value'];
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_WHAT_ROOM') {
								room = currentItem['@Value'];
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_RELATIONSHIP') {
								patientRelationship = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_FAMILY_ENGAGED') {
								familyEngaged = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
							}
						}
					}
					// concerns
					var concerns = [];
					var concernGroupArray = _.filter(currentStudyEvent.FormData.ItemGroupData, {'@ItemGroupOID': 'IG_MYSAF_MYCONCERNS'});
					for (var iConcernGroup = 0; iConcernGroup < concernGroupArray.length; iConcernGroup++) {
						currentItemGroup = concernGroupArray[iConcernGroup];
						for (iItem = 0; iItem < currentItemGroup.ItemData.length; iItem++) {
							currentItem = currentItemGroup.ItemData[iItem];
							if (currentItem['@ItemOID'] === 'I_MYSAF_CATEGORY') {
								concernCategory = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']).replace(/concern/gi, '').replace(/My /gi, '');
								concernCategory = _.capitalize(concernCategory);
								concernCategoryFilename = concernCategory.toLowerCase().replace(/\s+/g, '');
								concernCategoryFilename = concernCategory.toLowerCase().replace(/\s+/g, '');
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_SCALE') {
								concernSeverity = currentItem['@Value'];
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_CONCERN') {
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
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_INYOUROWNWORDS') {
								concernNarrative = currentItem['@Value'];
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_FIRST_OCCURRED') {
								concernFirstOccurred = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_SHARED_PREV') {
								concernShared = getTextValueFromNumber(studyResponse, currentItem['@ItemOID'], currentItem['@Value']);
							} else if (currentItem['@ItemOID'] === 'I_MYSAF_SHARED_PLAN') {
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
					concerns = _.sortByOrder(concerns, ['severity'], [false]);
					result[iSubject] = {
						status: status,
						date: date,
						name: name,
						room: room,
						concerns: concerns,
						patientRelationship: patientRelationship,
						familyEngaged: familyEngaged,
						followups: followups,
						metadata: metadata
					};
				}
			}
		}
		result = _.sortByOrder(result, ['status', 'date'], [true, false]);
	} catch (e) {
		console.error('Failed to parseODM:', e);
	}
	return result;
};
function objLength(obj){
  var i=0;
  for (var x in obj){
    if(obj.hasOwnProperty(x)){
      i++;
    }
  } 
  return i;
}

var getStudy = function(req,studyId, cb) {
	//var cachedResult = studyCache.get(studyId);
	var cachedResult;
	if (cachedResult === undefined) {
		console.log('ok:',req.user)
        //TODO: pass in APIKEY of logged in user
		//var username = localStorage.getItem("apiKey-"+req.user.username);
		
		//another method
		var username = req.user.apiKey;
		console.log('username:', username);
		var auth = "Basic " + new Buffer(username + ":").toString("base64");
		console.log('auth:', auth);
		request(
		{
			url : conf.get('ocUrl') + conf.get('odmPrePath') + studyId + conf.get('odmPostPath'),
			headers : {
				"Authorization" : auth
			}
		},function requestStudy(error, response, body) {
			if (!error && response.statusCode === 200) {

				var result = [];
				console.log("raw response", body);
				result = parseODM(body);
				console.log('studyret',result);
				studyCache.set(studyId, result);
				cb(200, result);
				
			}
			else {
				console.error('Unsuccessful ODM request:', error);
				cb(response.statusCode, error);
			}
		});
		/*request(
		{
			url : conf.get('ocUrl') + conf.get('odmPrePath') + studyId + conf.get('odmPostPath'),
			headers : {
				"Authorization" : auth
			}
		}*//*
		httpClient.get({
			  url : conf.get('ocUrl') + conf.get('odmPrePath') + studyId + conf.get('odmPostPath'),
			}).then(
			function requestSuccess(data) {
				var result = [];
				result = parseODM(body);
				studyCache.set(studyId, result);
				cb(200, result);
			},
			function requestFailed(data) {
				console.error('Unsuccessful ODM request:', error);
				cb(response.statusCode, error);
			});*/
			/*,function requestStudy(error, response, body) {
			if (!error && response.statusCode === 200) {
				var result = [];
				result = parseODM(body);
				studyCache.set(studyId, result);
				cb(200, result);
			}
			else {
				console.error('Unsuccessful ODM request:', error);
				cb(response.statusCode, error);
			}*/
	//	});
	} else {
		cb(cachedResult);
	}
};

module.exports = {
	get: getStudy
};
