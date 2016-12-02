function getResults() {
	// Retrite selected option
	var index = document.getElementById("state").selectedIndex;
	var state = document.getElementById("state").options[index].value;
	console.log(state);

	// Send server side 'GET' request, server side will render
	httpGetAsync("/senators/" + state, setStateInfo);
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

function setStateInfo(senateInfo)
{
	console.log("senate info response: " + senateInfo);
	console.log("Settings state info...");
}