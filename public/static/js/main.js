
var senateContainer = document.getElementById('senateCardContainer');
var houseOfRepsContainer = document.getElementById('houseOfRepsCardContainer');

function populateSenateUI() {
	var currentRow = document.createElement('div');

	// Remove all rows of previous cards
	while (senateContainer.firstChild) {
		senateContainer.removeChild(senateContainer.firstChild);
	}

	while (currentRow.firstChild) {
		currentRow.removeChild(currentRow.firstChild);
	}

	var newCard = document.createElement('div');
	newCard.innerHTML = federalSenatePartial;
	currentRow.className = 'row';
	currentRow.id = 'row';
	currentRow.appendChild(assignSenatorCards());
	currentRow.appendChild(assignSenatorCards());

	senateContainer.appendChild(currentRow);	
}

function populateHouseOfRepsUI() {
	var currentRow = document.createElement('div');

	// Remove all rows of previous cards
	while (houseOfRepsContainer.firstChild) {
		houseOfRepsContainer.removeChild(houseOfRepsContainer.firstChild);
	}

	while (currentRow.firstChild) {
		currentRow.removeChild(currentRow.firstChild);
	}

	// Populate federal senate info
	cardIndex = 0;
	var newCard = document.createElement('div');
	newCard.innerHTML = federalHouseOfRepsPartial;

	
	currentRow.className = 'row';
	var i = 0;
	for (i = 0; i < jsonReps.objects.length; i++) {
		if (currentRow.childElementCount == 3) {
			houseOfRepsContainer.appendChild(currentRow);

			currentRow = document.createElement('div');
			currentRow.className = 'row';
			
			currentRow.appendChild(assignRepresentativeCard());
		} else if (i == jsonReps.objects.length-1) {
			var currentCard = document.createElement('div');
			currentCard.className = "one-half column";
			
			currentRow.appendChild(assignRepresentativeCard());

			senateContainer.appendChild(currentRow);
		} else {
			currentRow.appendChild(assignRepresentativeCard());
		}
	}
	
	// Add last row of federal senators
	houseOfRepsContainer.appendChild(currentRow);	

	houseOfRepsContainer.style.display = "block";
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
	if (jsonSenate.objects[cardIndex].party == "Republican") {
		currentCard.className += " card-R ";
	} else if (jsonSenate.objects[cardIndex].party == "Democrat") {
		currentCard.className += " card-D ";
	} else if (jsonSenate.objects[cardIndex].party == "Independent") {
		currentCard.className += " card-I ";
	}

	var currentTemplate = federalHouseOfRepsPartial.slice();
	currentTemplate = currentTemplate.replace("[[FIRSTNAME]]", jsonSenate.objects[cardIndex].person.firstname.toString());
	currentTemplate = currentTemplate.replace("[[LASTNAME]]", jsonSenate.objects[cardIndex].person.lastname.toString());
	currentTemplate = currentTemplate.replace("[[STATE]]", jsonSenate.objects[cardIndex].state.toString());
	currentTemplate = currentTemplate.replace("[[PARTY]]", jsonSenate.objects[cardIndex].party.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE]]", jsonSenate.objects[cardIndex].person.link.toString());
	currentTemplate = currentTemplate.replace("[[CONTACT]]", jsonSenate.objects[cardIndex].extra.contact_form.toString());

	var imageUrl = "https://theunitedstates.io/images/congress/225x275/"
	imageUrl += jsonSenate.objects[cardIndex].person.bioguideid.toString() + ".jpg";
	currentTemplate = currentTemplate.replace("[[IMAGE]]", imageUrl);


	if (cardIndex < jsonSenate.objects.length-1) {
		cardIndex++;
	} else {
		cardIndex = 0;
	}

	counter++;
	currentCard.innerHTML = currentTemplate;
	currentCard.style.opacity = 1;
	return currentCard;
}

var jsonReps = {};
function assignRepresentativeCard()
{
	var currentCard = document.createElement('div');
	currentCard.className = "one-third column";
	if (jsonReps.objects[cardIndex].party == "Republican") {
		currentCard.className += " card-R ";
	} else if (jsonReps.objects[cardIndex].party == "Democrat") {
		currentCard.className += " card-D ";
	} else if (jsonReps.objects[cardIndex].party == "Independent") {
		currentCard.className += " card-I ";
	}

	var currentTemplate = federalHouseOfRepsPartial.slice();
	currentTemplate = currentTemplate.replace("[[FIRSTNAME]]", jsonReps.objects[cardIndex].person.firstname.toString());
	currentTemplate = currentTemplate.replace("[[LASTNAME]]", jsonReps.objects[cardIndex].person.lastname.toString());
	currentTemplate = currentTemplate.replace("[[STATE]]", jsonReps.objects[cardIndex].state.toString());
	currentTemplate = currentTemplate.replace("[[PARTY]]", jsonReps.objects[cardIndex].party.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE]]", jsonReps.objects[cardIndex].person.link.toString());
	currentTemplate = currentTemplate.replace("[[WEBSITE]]", jsonReps.objects[cardIndex].person.link.toString());
	currentTemplate = currentTemplate.replace("[[CONTACT]]", jsonReps.objects[cardIndex].extra.contact_form.toString());
	currentTemplate = currentTemplate.replace("[[CONTACT]]", jsonReps.objects[cardIndex].extra.contact_form.toString());

	var imageUrl = "https://theunitedstates.io/images/congress/225x275/"
	imageUrl += jsonReps.objects[cardIndex].person.bioguideid.toString() + ".jpg";
	currentTemplate = currentTemplate.replace("[[IMAGE]]", imageUrl);

	if (cardIndex < jsonReps.objects.length-1) {
		cardIndex++;
	} else {
		cardIndex = 0;
	}

	counter++;
	currentCard.innerHTML = currentTemplate;
	currentCard.style.opacity = 1;

	return currentCard;
}

function getResults() {
	senateContainer = document.getElementById('senateCardContainer');
	houseOfRepsContainer = document.getElementById('houseOfRepsCardContainer')

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

function setSenateInfo(senateInfo) {
	//console.log("senate info: " + senateInfo);
	jsonSenate = JSON.parse(senateInfo);

	document.getElementById('branch').style.opacity = 1;
	document.getElementById('scopeBranch').style.opacity = 1;
	document.getElementById('groupBranch1').style.opacity = 1;
	document.getElementById('groupBranch2').style.opacity = 1;
	populateSenateUI();
}


function setRepsInfo(repsInfo) {
	//console.log("representatives info response: " + repsInfo);
	jsonReps = JSON.parse(repsInfo);
	//console.log(repsInfo);
	populateHouseOfRepsUI();
}