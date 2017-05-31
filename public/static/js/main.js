
var federalSenateContainer = document.getElementById('federalSenateCardContainer');
var federalHouseOfRepsContainer = document.getElementById('federalHouseOfRepsCardContainer');
var stateSenateContainer = document.getElementById('stateSenateCardContainer');
var stateHouseOfRepsContainer = document.getElementById('stateHouseOfRepsCardContainer');

function populateFederalSenateUI() {
	var currentRow = document.createElement('div');

	// Remove all rows of previous cards
	while (federalSenateContainer.firstChild) {
		federalSenateContainer.removeChild(federalSenateContainer.firstChild);
	}

	while (currentRow.firstChild) {
		currentRow.removeChild(currentRow.firstChild);
	}

	var newCard = document.createElement('div');
	newCard.innerHTML = htmlCardPartial;
	currentRow.className = 'row';
	currentRow.id = 'row';

	// Set up HTML for both senators 
	currentRow.appendChild(assignFederalSenatorCards());
	currentRow.appendChild(assignFederalSenatorCards());

	federalSenateContainer.appendChild(currentRow);	
}
function populateStateSenateUI() {
	var currentRow = document.createElement('div');

	// Remove all rows of previous cards
	while (stateSenateContainer.firstChild) {
		stateSenateContainer.removeChild(stateSenateContainer.firstChild);
	}

	while (currentRow.firstChild) {
		currentRow.removeChild(currentRow.firstChild);
	}

	// Populate federal senate info
	cardIndex = 0;
	var newCard = document.createElement('div');
	newCard.innerHTML = htmlCardPartial;

	
	currentRow.className = 'row';
	var i = 0;
	for (i = 0; i < jsonStateSenate.length; i++) {
		if (currentRow.childElementCount == 3) {
			stateSenateContainer.appendChild(currentRow);

			currentRow = document.createElement('div');
			currentRow.className = 'row';
			
			currentRow.appendChild(assignStateSenatorCards());
		} else if (i == jsonStateSenate.length-1) {
			var currentCard = document.createElement('div');
			currentCard.className = "one-half column";
			
			currentRow.appendChild(assignStateSenatorCards());

			stateSenateContainer.appendChild(currentRow);
		} else {
			currentRow.appendChild(assignStateSenatorCards());
		}
	}
	
	// Add last row of federal senators
	stateSenateContainer.appendChild(currentRow);	
}

function populateFederalHouseOfRepsUI() {
	var currentRow = document.createElement('div');

	// Remove all rows of previous cards
	while (federalHouseOfRepsContainer.firstChild) {
		federalHouseOfRepsContainer.removeChild(federalHouseOfRepsContainer.firstChild);
	}

	while (currentRow.firstChild) {
		currentRow.removeChild(currentRow.firstChild);
	}

	// Populate federal senate info
	cardIndex = 0;
	var newCard = document.createElement('div');
	newCard.innerHTML = htmlCardPartial;

	
	currentRow.className = 'row';
	var i = 0;
	for (i = 0; i < jsonFederalReps.results.length; i++) {
		if (currentRow.childElementCount == 3) {
			federalHouseOfRepsContainer.appendChild(currentRow);

			currentRow = document.createElement('div');
			currentRow.className = 'row';
			
			currentRow.appendChild(assignFederalRepresentativeCard());
		} else if (i == jsonFederalReps.results.length-1) {
			var currentCard = document.createElement('div');
			currentCard.className = "one-half column";
			
			currentRow.appendChild(assignFederalRepresentativeCard());

			federalHouseOfRepsContainer.appendChild(currentRow);
		} else {
			currentRow.appendChild(assignFederalRepresentativeCard());
		}
	}
	
	// Add last row of federal senators
	federalHouseOfRepsContainer.appendChild(currentRow);	
}
function populateStateHouseOfRepsUI() {
	var currentRow = document.createElement('div');

	// Remove all rows of previous cards
	while (stateHouseOfRepsContainer.firstChild) {
		stateHouseOfRepsContainer.removeChild(stateHouseOfRepsContainer.firstChild);
	}

	while (currentRow.firstChild) {
		currentRow.removeChild(currentRow.firstChild);
	}

	// Populate federal senate info
	cardIndex = 0;
	var newCard = document.createElement('div');
	newCard.innerHTML = htmlCardPartial;

	
	currentRow.className = 'row';
	var i = 0;
	for (i = 0; i < jsonStateReps.length; i++) {
		if (currentRow.childElementCount == 3) {
			stateHouseOfRepsContainer.appendChild(currentRow);

			currentRow = document.createElement('div');
			currentRow.className = 'row';
			
			currentRow.appendChild(assignStateRepresentativeCard());
		} else if (i == jsonStateReps.length-1) {
			var currentCard = document.createElement('div');
			currentCard.className = "one-half column";
			
			currentRow.appendChild(assignStateRepresentativeCard());

			stateHouseOfRepsContainer.appendChild(currentRow);
		} else {
			currentRow.appendChild(assignStateRepresentativeCard());
		}
	}
	
	// Add last row of federal senators
	stateHouseOfRepsContainer.appendChild(currentRow);	
}


function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

// Legislative JSON Info
var jsonFederalSenate = {};
var jsonFederalReps = {};
var jsonStateSenate = {};
var jsonStateReps = {};

// Executive JSON Info
var jsonFederalExecs = {};
var jsonStateExecs = {};
var counter = 0;
var cardIndex = 0;
function assignFederalSenatorCards()
{
	var currentCard = document.createElement('div');
	currentCard.className = "one-half column";
	assignCard(currentCard, jsonFederalSenate, cardIndex);

	var currentTemplate = htmlCardPartial.slice();
	currentTemplate = currentTemplate.replace("[[FIRSTNAME]]", jsonFederalSenate[cardIndex].name.toString());
	currentTemplate = currentTemplate.replace("[[STATE]]", jsonFederalSenate[cardIndex].state.toString());

	// Use full party name
	let partyName = jsonFederalSenate[cardIndex].party;
	if (partyName === 'D') {
		partyName = "Democrat";
	} else if (partyName === 'R') {
		partyname = "Republican";
	} else {
		partyName = "Independent";
	}
	jsonFederalSenate[cardIndex].party = partyName;

	currentTemplate = currentTemplate.replace("[[PARTY]]", jsonFederalSenate[cardIndex].party.toString());

	var imageUrl = "https://theunitedstates.io/images/congress/225x275/"
	imageUrl += jsonFederalSenate[cardIndex].id.toString() + ".jpg";
	currentTemplate = currentTemplate.replace("[[IMAGE]]", "src='" + imageUrl + "'");

	if (cardIndex < jsonFederalSenate.length-1) {
		cardIndex++;
	} else {
		cardIndex = 0;
	}

	counter++;
	currentCard.innerHTML = currentTemplate;
	currentCard.style.opacity = 1;
	return currentCard;
}

function assignFederalRepresentativeCard()
{
	var currentCard = document.createElement('div');
	currentCard.className = "one-third column";
	assignCard(currentCard, jsonFederalReps.results, cardIndex);

	var currentTemplate = htmlCardPartial.slice();
	currentTemplate = currentTemplate.replace("[[FIRSTNAME]]", jsonFederalReps.results[cardIndex].person.firstname.toString());
	currentTemplate = currentTemplate.replace("[[LASTNAME]]", jsonFederalReps.results[cardIndex].person.lastname.toString());
	currentTemplate = currentTemplate.replace("[[STATE]]", jsonFederalReps.results[cardIndex].state.toString().toUpperCase());
	currentTemplate = currentTemplate.replace("[[PARTY]]", jsonFederalReps.results[cardIndex].party.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE]]", jsonFederalReps.results[cardIndex].person.link.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE_DESC]]", "GovTrack");

	var imageUrl = "https://theunitedstates.io/images/congress/225x275/"
	imageUrl += jsonFederalReps.results[cardIndex].person.bioguideid.toString() + ".jpg";
	currentTemplate = currentTemplate.replace("[[IMAGE]]", "src='" + imageUrl + "'");

	if (cardIndex < jsonFederalReps.results.length-1) {
		cardIndex++;
	} else {
		cardIndex = 0;
	}

	counter++;
	currentCard.innerHTML = currentTemplate;
	currentCard.style.opacity = 1;

	return currentCard;
}

function assignStateSenatorCards()
{
	var currentCard = document.createElement('div');
	currentCard.className = "one-third column";
	assignCard(currentCard, jsonStateSenate, cardIndex);

	var currentTemplate = htmlCardPartial.slice();
	currentTemplate = currentTemplate.replace("[[FIRSTNAME]]", jsonStateSenate[cardIndex].first_name.toString());
	currentTemplate = currentTemplate.replace("[[LASTNAME]]", jsonStateSenate[cardIndex].last_name.toString());
	currentTemplate = currentTemplate.replace("[[STATE]]", jsonStateSenate[cardIndex].state.toString().toUpperCase());
	currentTemplate = currentTemplate.replace("[[PARTY]]", jsonStateSenate[cardIndex].party.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE]]", jsonStateSenate[cardIndex].url.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE_DESC]]", "Official Site");

	var imageUrl = jsonStateSenate[cardIndex].photo_url;
	imageUrl = "src='" + imageUrl + "' width='225px' height='275px'";
	currentTemplate = currentTemplate.replace("[[IMAGE]]", imageUrl);

	if (cardIndex < jsonStateSenate.length-1) {
		cardIndex++;
	} else {
		cardIndex = 0;
	}

	counter++;
	currentCard.innerHTML = currentTemplate;
	currentCard.style.opacity = 1;
	return currentCard;
}

function assignStateRepresentativeCard()
{
	var currentCard = document.createElement('div');
	currentCard.className = "one-third column";

	assignCard(currentCard, jsonStateReps, cardIndex);

	var currentTemplate = htmlCardPartial.slice();
	currentTemplate = currentTemplate.replace("[[FIRSTNAME]]", jsonStateReps[cardIndex].first_name.toString());
	currentTemplate = currentTemplate.replace("[[LASTNAME]]", jsonStateReps[cardIndex].last_name.toString());
	currentTemplate = currentTemplate.replace("[[STATE]]", jsonStateReps[cardIndex].state.toString().toUpperCase());
	currentTemplate = currentTemplate.replace("[[PARTY]]", jsonStateReps[cardIndex].party.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE]]", jsonStateReps[cardIndex].url.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE_DESC]]", "Official Site");

	var imageUrl = jsonStateReps[cardIndex].photo_url;
	imageUrl = "src='" + imageUrl + "' width='225px' height='275px'";
	currentTemplate = currentTemplate.replace("[[IMAGE]]", imageUrl);

	if (cardIndex < jsonStateReps.length-1) {
		cardIndex++;
	} else {
		cardIndex = 0;
	}

	counter++;
	currentCard.innerHTML = currentTemplate;
	currentCard.style.opacity = 1;
	return currentCard;
}

function assignCard(card, json, index)
{
	if (json[index].party === "Republican" || json[index].party === "R") {
		card.className += " card-R ";
	} else if (json[index].party === "Democratic" || json[index].party === "Democrat" || json[index].party === "D") {
		card.className += " card-D ";
	} else if (json[index].party === "Independent" || json[index].party === "I") {
		card.className += " card-I ";
	}
}

// handle GET Requests for 
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getResults() {
	federalSenateContainer = document.getElementById('federalSenateCardContainer');
	federalHouseOfRepsContainer = document.getElementById('federalHouseOfRepsCardContainer');
	

	// Retrite selected option
	var index = document.getElementById("state").selectedIndex;
	var state = document.getElementById("state").options[index].value;
	//console.log(state);

	// Send HTTP GET requests to server side
	// LEGISLATIVE
	// FEDERAL
	httpGetAsync("/senate/federal/" + state, setFederalSenateInfo);
	//httpGetAsync("/house/federal/" + state, setFederalRepsInfo);

	
}

function getStateSenResults()
{
	stateSenateContainer = document.getElementById('stateSenateCardContainer');
	
	var index = document.getElementById("state").selectedIndex;
	var state = document.getElementById("state").options[index].value;

	// STATE
	httpGetAsync("/senators/state/" + state, setStateSenateInfo);
	
}

function getStateRepsResults()
{
	stateHouseOfRepsContainer = document.getElementById('stateHouseOfRepsCardContainer');

	var index = document.getElementById("state").selectedIndex;
	var state = document.getElementById("state").options[index].value;

	httpGetAsync("/representatives/state/" + state, setStateRepsInfo);
}

function setStateSenateInfo(senateInfo) {
	//console.log("representatives info response: " + repsInfo);
	jsonStateSenate = JSON.parse(senateInfo);

	// TODO: Remove button
	document.getElementById('stateSenButton').style.display = 'none';
	
	populateStateSenateUI();
	
}

function setStateRepsInfo(repsInfo) {
	//console.log("representatives info response: " + repsInfo);
	jsonStateReps = JSON.parse(repsInfo);

	// TODO: Remove button
	document.getElementById('stateRepsButton').style.display = 'none';

	populateStateHouseOfRepsUI();
}

function setFederalSenateInfo(senateInfo) {
	//console.log("senate info: " + senateInfo);
	jsonFederalSenate = JSON.parse(senateInfo);

	populateFederalSenateUI();

	// Enable Senator parent UI
	document.getElementById('branch').style.opacity = 1;
	document.getElementById('scopeBranch1').style.opacity = 1;

	// Enable Senators UI
	document.getElementById('groupBranch1').style.opacity = 1;
}

function setFederalRepsInfo(repsInfo) {
	//console.log("representatives info response: " + repsInfo);
	jsonFederalReps = JSON.parse(repsInfo);
	//console.log(repsInfo);
	populateFederalHouseOfRepsUI();

	// Enable Reps UI
	document.getElementById('groupBranch2').style.opacity = 1;

	// Enable state senate UI
	document.getElementById('scopeBranch2').style.opacity = 1;
	document.getElementById('groupBranch3').style.opacity = 1;

	// Enable state reps UI
	document.getElementById('groupBranch4').style.opacity = 1;
}

function setFederalExecutiveInfo(execInfo) {
	jsonFederalExecs = JSON.parse(execInfo);

	//populateFederalExecsUI();

	// Enable federal UI
	document.getElementById('groupBranch5');
}

function setStateExecutiveInfo(execInfo) {
	jsonStateExecs = JSON.parse(execInfo);

	//populateStateExecsUI();

	document.getElementById('groupBranch6');
}