package main

import (
	"encoding/xml"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

///////////////////
/// LEGISLATIVE ///
///////////////////

// Senate structs
type Senate struct {
	Members []Senator `xml:"member"`
}

type Senator struct {
	Member_full string   `xml:"member_full"`
	Last_name   string   `xml:"last_name"`
	First_name  string   `xml:"first_name"`
	Party       string   `xml:"party"`
	State       string   `xml:"state"`
	Address     string   `xml:"address"`
	Phone       string   `xml:"phone"`
	Email       string   `xml:"email"`
	Website     string   `xml:"website"`
	Class       string   `xml:"class"`
}

// House of Representatives structs
type HouseOfReps struct {
	Members []Representative `json:"objects"`
}

type Representative struct {
	Party string `json:"party"`
	State string `json:"state"`
	Phone string `json:"phone"`
	Website string `json:"website"`
	ExtraInfo Extra `json:"extra"`
	MemberInfo Member `json:"person"`
}

type Extra struct {
	Address string `json:"address"`
	Email string `json:"contact_form"`
}

type Member struct {
	First_name string `json:"firstname"`
	Last_name string `json:"lastname"`
	Full_name string `json:"full_name"`
	Website string `json:"link"`
}

// Serve HTML
func serveHome(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "."+r.URL.Path)
}

// Serve JSON
func serveSenateInfo(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get("http://www.senate.gov/general/contact_information/senators_cfm.xml")

	if err != nil {
		log.Println(err.Error());
		http.Error(w, err.Error(), 500);
		return;
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err.Error());
		http.Error(w, err.Error(), 500);
		return;
	}

	var xmlSenate Senate
	err_2 := xml.Unmarshal(body, &xmlSenate)
	if err_2 != nil {
		log.Printf("Error: %v", err_2);
		http.Error(w, err.Error(), 500);
		return;
	}

	inputState := r.URL.Path[len(r.URL.Path)-2:len(r.URL.Path)]
	stateSenators := findSenatorsByState(inputState, xmlSenate);

	// Send state senator information response in JSON
	w.Header().Set("Content-Type", "application/json");
	json.NewEncoder(w).Encode(stateSenators);
}

// Serve JSON
func serveRepInfo(w http.ResponseWriter, r *http.Request) {
	inputState := r.URL.Path[len(r.URL.Path)-2:len(r.URL.Path)]

	getUrl := "https://www.govtrack.us/api/v2/role?current=true&role_type=representative";
	getUrl += "&state=" + inputState;
	resp, err := http.Get(getUrl);

	if err != nil {
		log.Println(err.Error());
		http.Error(w, err.Error(), 500);
		return;
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err.Error());
		http.Error(w, err.Error(), 500);
		return;
	}

	var jsonReps HouseOfReps
	err_2 := json.Unmarshal(body, &jsonReps)
	if err_2 != nil {
		log.Printf("Error: %v", err_2);
		http.Error(w, err.Error(), 500);
		return;
	}

	// Send state reps information response in JSON
	w.Header().Set("Content-Type", "application/json");
	json.NewEncoder(w).Encode(jsonReps);
}

// Helper function for senate searching
func findSenatorsByState(state string, senators Senate) [2]Senator {
	var stateSenators [2]Senator;
	index := 0;
	for i := range senators.Members {
		if (senators.Members[i].State == state) {
			if (index == 0) {
				stateSenators[0] = senators.Members[i];
			} else {
				stateSenators[1] = senators.Members[i];
			}

			index++;
		}
	}

	return stateSenators;
}

func main() {
	// Serve Home
	http.HandleFunc("/", serveHome)

	// Serve state information
	http.HandleFunc("/senators/", serveSenateInfo)
	http.HandleFunc("/representatives/", serveRepInfo)

	http.ListenAndServe(":8080", nil)
}
