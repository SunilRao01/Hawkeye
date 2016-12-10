

var currentRow = document.createElement('div');
var senateContainer = document.getElementById('senateCardContainer');
var houseOfRepsContainer = document.getElementById('houseOfRepsCardContainer');

function delayDisplay(newState) {
	setTimeout(function() {
		senateContainer.style.display = "block";
	}, 100);
}

function populateSenateUI() {
	senateContainer.style.display = "none";
	
	while (currentRow.childElementCount > 0) {
		currentRow.removeChild(currentRow.firstChild);
	}

	var newCard = document.createElement('div');
	newCard.innerHTML = federalSenatePartial;
	currentRow.className = 'row';
	currentRow.appendChild(assignSenatorCards());
	currentRow.appendChild(assignSenatorCards());

	senateContainer.appendChild(currentRow);	

	senateContainer.style.display = "block";
}

function populateHouseOfRepsUI() {
	while (houseOfRepsContainer.firstChild) {
		houseOfRepsContainer.removeChild(houseOfRepsContainer.firstChild);
	}
	while (currentRow.firstChild) {
		currentRow.removeChild(currentRow.firstChild);
	}

	// Populate federal senate info
	cardIndex = 0;
	var newCard = document.createElement('div');
	newCard.innerHTML = federalSenatePartial;

	
	currentRow.className = 'row';
	var i = 0;
	for (i = 0; i < jsonSenate.length; i++) {
		if (currentRow.childElementCount == 3) {
			senateContainer.appendChild(currentRow);
			

			currentRow = document.createElement('div');
			currentRow.className = 'row';
			
			currentRow.appendChild(getAnotherCard());
		} else if (i == jsonSenate.length-1) {
			var currentCard = document.createElement('div');
			currentCard.className = "one-half column";
			
			currentRow.appendChild(getAnotherCard());

			senateContainer.appendChild(currentRow);
		} else {
			currentRow.appendChild(getAnotherCard());
		}
	}
	
	// Add last row of federal senators
	senateContainer.appendChild(currentRow);	

	delayDisplay();
}



function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

var jsonSenate = {};
var counter = 0;
var cardIndex = 0;
function assignSenatorCards()
{
	var currentCard = document.createElement('div');
	currentCard.className = "one-half column";
	if (jsonSenate[cardIndex].Party == "R") {
		currentCard.className += " card-R ";
	} else if (jsonSenate[cardIndex].Party == "D") {
		currentCard.className += " card-D ";
	} else if (jsonSenate[cardIndex].Party == "I") {
		currentCard.className += " card-I ";

	}

	var currentTemplate = federalSenatePartial.slice();
	currentTemplate = currentTemplate.replace("[[FIRSTNAME]]", jsonSenate[cardIndex].First_name.toString());
	currentTemplate = currentTemplate.replace("[[LASTNAME]]", jsonSenate[cardIndex].Last_name.toString());
	currentTemplate = currentTemplate.replace("[[STATE]]", jsonSenate[cardIndex].State.toString());
	currentTemplate = currentTemplate.replace("[[PARTY]]", jsonSenate[cardIndex].Party.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE]]", jsonSenate[cardIndex].Website.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE]]", jsonSenate[cardIndex].Website.toString());
	currentTemplate = currentTemplate.replace("[[CONTACT]]", jsonSenate[cardIndex].Email.toString());
	currentTemplate = currentTemplate.replace("[[CONTACT]]", jsonSenate[cardIndex].Email.toString());

	if (cardIndex < jsonSenate.length-1) {
		cardIndex++;
	} else {
		cardIndex = 0;
	}

	counter++;
	currentCard.innerHTML = currentTemplate;

	return currentCard;
}



function getResults() {
	senateContainer = document.getElementById('senateCardContainer');

	// Hide cards before they're loaded
	senateContainer.style.display = "none";

	// Retrite selected option
	var index = document.getElementById("state").selectedIndex;
	var state = document.getElementById("state").options[index].value;
	console.log(state);

	// LEGISLATIVE
	// Get state senators
	httpGetAsync("/senators/" + state, setSenateInfo);
	// Get state representatives
	httpGetAsync("/representatives/" + state, setRepsInfo);
}

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



function setSenateInfo(senateInfo) {
	console.log("senate info: " + senateInfo);
	jsonSenate = JSON.parse(senateInfo);

	populateSenateUI();
}

function setRepsInfo(repsInfo) {
	console.log("representatives info response: " + repsInfo);
	//console.log("Settings HouseOfReps info...");

	//populateHouseOfRepsUI();
}
