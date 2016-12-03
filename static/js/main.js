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
}

function setRepsInfo(repsInfo) {
	console.log("representatives info response: " + repsInfo);
	console.log("Settings HouseOfReps info...");
}