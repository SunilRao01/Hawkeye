var cardTemplate = `
                      <h4 class="card-name">[[NUM]]. John Doe</h4>
                      <h6 class="card-state">IL</h6>
                      <center><img class="u-max-full-width card-image" src="/static/images/sample-person.jpg"></center>
                      <div class="container">
                        <div class="row">
                          <p class="one-half column card-label">Party:</p>
                          <p class="one-half column card-description">[[PARTY]]</p>
                        </div>
                        <hr>
                        <div class="row">
                          <p class="one-half column card-label">Website:</p>
                          <p class="one-half column card-description">[[WEBSITE]]</p>
                        </div>
                        <hr>
                        <div class="row">
                          <p class="one-half column card-label">Contact:</p>
                          <p class="one-half column card-description">[[CONTACT]]</p>
                        </div>
                      </div>
                  `;
var currentRow = document.createElement('div');
function populateUI()
{
	// NOTE: Currenly populating UI info with dummy data for testing purposes,
	// later on, use the information from the JSON responses
	


	// NOTE: For now, populate it with 6 dummies for UI testing
	var newCard = document.createElement('div');
	newCard.innerHTML = cardTemplate;

	
	currentRow.className = 'row';
	var i = 0;
	var tempCardCount = 4;
	for (i = 0; i < tempCardCount; i++) {
		if (currentRow.childElementCount == 3) {
			console.log('making new row! @ step: ' + i);
			document.getElementById('cardContainer').appendChild(currentRow);
			

			currentRow = document.createElement('div');
			currentRow.className = 'row';
			
			currentRow.appendChild(getAnotherCard());
			
			console.log('new row count: ' + currentRow.childElementCount)
		} else if (i == tempCardCount-1) {
			console.log('last element reached?' + i);

			var currentCard = document.createElement('div');
			currentCard.className = "one-third column card-D";
			

			currentRow.appendChild(getAnotherCard());

			document.getElementById('cardContainer').appendChild(currentRow);
		} else {
			console.log("step: " + i);
			// TODO: Would actually get the card ready, not dummies like now
			currentRow.appendChild(getAnotherCard());
		}
	}
	
	document.getElementById('cardContainer').appendChild(currentRow);
	console.log('finished... Card Count: ' + tempCardCount);
	

	
}

var counter = 0;

function getAnotherCard()
{
	var currentCard = document.createElement('div');
	currentCard.className = "one-third column card-D";
			

	assignCardTemplate(counter);
	counter++;
	currentCard.innerHTML = cardTemplate;
	return currentCard;
}

function assignCardTemplate(inputVar)
{
	cardTemplate = cardTemplate.replace("[[NUM]]", inputVar);
	cardTemplate = cardTemplate.replace("[[PARTY]]", "N/A");
	cardTemplate = cardTemplate.replace("[[WEBSITE]]", "N/A");
	cardTemplate = cardTemplate.replace("[[CONTACT]]", "N/A");
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
	console.log("senate info response: " + senateInfo);
	console.log("Settings senate info...");

	populateUI();
}

function setRepsInfo(repsInfo) {
	console.log("representatives info response: " + repsInfo);
	console.log("Settings HouseOfReps info...");
}