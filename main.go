package main

import (
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
	Members []Senator `json:"objects"`
}

type Senator struct {
	Party string `json:"party"`
	State string `json:"state"`
	Phone string `json:"phone"`
	Description string `json:"description"`
	EndDate string `json:"enddate"`
	Website string `json:"website"`
	ExtraInfo Extra `json:"extra"`
	MemberInfo Member `json:"person"`
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
	Bioguideid string `json:"bioguideid"`
	Name string `json:"name"`
	First_name string `json:"firstname"`
	Last_name string `json:"lastname"`
	Full_name string `json:"full_name"`
	Website string `json:"link"`
}

// Serve JSON
func serveSenateInfo(w http.ResponseWriter, r *http.Request) {
	inputState := r.URL.Path[len(r.URL.Path)-2:len(r.URL.Path)]

	getUrl := "https://www.govtrack.us/api/v2/role?current=true&role_type=senator";
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

	var jsonSenate Senate
	err_2 := json.Unmarshal(body, &jsonSenate)
	if err_2 != nil {
		log.Printf("Error: %v", err_2);
		http.Error(w, err.Error(), 500);
		return;
	}

	// Send state reps information response in JSON
	w.Header().Set("Content-Type", "application/json");
	json.NewEncoder(w).Encode(jsonSenate);
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

// Serve HTML
func serveHome(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./public" + r.URL.Path)
}

func main() {
	// Serve Home
	http.HandleFunc("/", serveHome)

	// Serve state information
	http.HandleFunc("/senators/", serveSenateInfo)
	http.HandleFunc("/representatives/", serveRepInfo)

	http.ListenAndServe(":8080", nil)
}
