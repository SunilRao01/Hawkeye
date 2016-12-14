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

// GovTrack API json struct
type GovTrack_Chamber struct {
	Members []GovTrack_Official `json:"objects"`
}

type GovTrack_Official struct {
	Party string `json:"party"`
	State string `json:"state"`
	Phone string `json:"phone"`
	Description string `json:"description"`
	EndDate string `json:"enddate"`
	Website string `json:"website"`
	ExtraInfo GovTrack_Extra `json:"extra"`
	MemberInfo GovTrack_Member `json:"person"`
}

type GovTrack_Extra struct {
	Address string `json:"address"`
	Email string `json:"contact_form"`
}

type GovTrack_Member struct {
	Bioguideid string `json:"bioguideid"`
	Name string `json:"name"`
	First_name string `json:"firstname"`
	Last_name string `json:"lastname"`
	Full_name string `json:"full_name"`
	Website string `json:"link"`
}

// OpenStates API json struct
type OpenStates_Chamber struct {
	Members []GovTrack_Official `json:"objects"`
}

type OpenStates_Official struct {
	First_name string `json:"first_name"`
	Last_name string `json:"last_name"`
	Party string `json:"party"`
	State string `json:"state"`
	Website string `json:"url"`
	Email string `json:"email"`
	Photo string `json:"photo_url"`
	ExtraInfo OpenStates_Office `json:"offices"`
}

type OpenStates_Office struct {
	Phone string `json:"phone"`
}

// Serve JSON
func serveFederalStateInfo(url string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		inputState := r.URL.Path[len(r.URL.Path)-2:len(r.URL.Path)]
		
		getUrl := url;
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

		var jsonReps GovTrack_Chamber;
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
}

// Serve JSON
func serveLocalStateInfo(url string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		inputState := r.URL.Path[len(r.URL.Path)-2:len(r.URL.Path)]
		
		getUrl := url;
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

		var jsonReps OpenStates_Chamber;
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
}

// Serve HTML
func serveHome(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./public" + r.URL.Path)
}

func main() {
	// Serve Home
	http.HandleFunc("/", serveHome)

	// Serve state information
	http.HandleFunc("/senators/federal/", serveFederalStateInfo("https://www.govtrack.us/api/v2/role?current=true&role_type=senator"))
	http.HandleFunc("/representatives/federal/", serveFederalStateInfo("https://www.govtrack.us/api/v2/role?current=true&role_type=representative"))

	
	http.HandleFunc("/senators/state/", serveFederalStateInfo("https://openstates.org/api/v1/legislators/?active=true&chamber=upper"))
	http.HandleFunc("/representatives/state/", serveFederalStateInfo("https://openstates.org/api/v1/legislators/?active=true&chamber=lower"))

	http.ListenAndServe(":8080", nil)
}
