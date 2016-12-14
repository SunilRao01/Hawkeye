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

// GovTrack API Members json struct
type Chamber struct {
	Members []Official `json:"objects"`
}

type Official struct {
	Party string `json:"party"`
	State string `json:"state"`
	Phone string `json:"phone"`
	Description string `json:"description"`
	EndDate string `json:"enddate"`
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

	var jsonSenate Chamber
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

	var jsonReps Chamber;
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
