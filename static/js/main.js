var federalSenatePartial = 
`
  <h4 class="card-name">[[FIRSTNAME]] [[LASTNAME]]</h4>
  <h6 class="card-state">[[STATE]]</h6>
  <center><img class="u-max-full-width card-image" src="/static/images/sample-person.jpg"></center>
  <div class="container">
    <div class="row">
      <p class="one-half column card-label">Party:</p>
      <p class="one-half column card-description">[[PARTY]]</p>
    </div>
    <hr>
    <div class="row">
      <p class="one-half column card-label">Website:</p>
      <a href="[[WEBSITE]]" target="_blank" class="one-half column card-description">[[WEBSITE]]</a>
    </div>
    <hr>
    <div class="row">
      <p class="one-half column card-label">Contact:</p>
      <a href="[[CONTACT]]" class="one-half column card-description">[[CONTACT]]</p>
    </div>
  </div>
`;

var currentRow = document.createElement('div');
var container;
function populateUI()
{
	container = document.getElementById('cardContainer');
	

	// Populate federal senate info
	cardIndex = 0;
	var newCard = document.createElement('div');
	newCard.innerHTML = federalSenatePartial;

	
	currentRow.className = 'row';
	var i = 0;
	for (i = 0; i < jsonSenate.length; i++) {
		if (currentRow.childElementCount == 3) {
			container.appendChild(currentRow);
			

			currentRow = document.createElement('div');
			currentRow.className = 'row';
			
			currentRow.appendChild(getAnotherCard());
			
		} else if (i == jsonSenate.length-1) {

			var currentCard = document.createElement('div');
			currentCard.className = "one-half column";
			
			

			currentRow.appendChild(getAnotherCard());

			container.appendChild(currentRow);
		} else {
			// TODO: Would actually get the card ready, not dummies like now
			currentRow.appendChild(getAnotherCard());
		}
	}
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
	// Add last row of federal senators
	container.appendChild(currentRow);	
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

var jsonSenate = {};
var counter = 0;
var cardIndex = 0;
function getAnotherCard()
{
	var currentCard = document.createElement('div');
	currentCard.className = "one-half column";
	if (jsonSenate[cardIndex].Party == "R") {
		currentCard.className += " card-R ";
	} else if (jsonSenate[cardIndex].Party == "D") {
		currentCard.className += " card-D ";
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
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}



function setSenateInfo(senateInfo) {
	jsonSenate = JSON.parse(senateInfo);


	populateUI();
}

function setRepsInfo(repsInfo) {
	//console.log("representatives info response: " + repsInfo);
	//console.log("Settings HouseOfReps info...");
}