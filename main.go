package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"fmt"
)

///////////////////
/// CREDENTIALS ///
///////////////////
type Creds struct {
	ProPublica_API_Key string `json:"ProPublica_API_Key"`
}

///////////////////
/// LEGISLATIVE ///
///////////////////

// GovTrack API json struct
type ProPublica_Members struct {
	Results []ProPublica_Official `json:"results"`,
	state string `json:"state"`
}

type ProPublica_Official struct {
	Party string `json:"party"`
	State string `json:"state"`
	ApiUri string `json:"api_uri"`
	Description string `json:"twitter_id"`
	EndDate string `json:"enddate"`
	Website string `json:"website"`
	ExtraInfo GovTrack_Extra `json:"extra"`
	MemberInfo GovTrack_Member `json:"person"`
}

type ProPublica_Member struct {
	Results []ProPublica_Member
}

type ProPublica_OfficialInfo struct {

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
type OpenStates_Official struct {
	Full_name string `json:"full_name"`
	First_name string `json:"first_name"`
	Last_name string `json:"last_name"`
	Party string `json:"party"`
	State string `json:"state"`
	Website string `json:"url"`
	Email string `json:"email"`
	Photo string `json:"photo_url"`
	//ExtraInfo OpenStates_Office `json:"offices"`
}

type OpenStates_Office struct {
	Phone string `json:"phone"`
}

// Serve JSON
func serveFederalStateInfo(url string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		inputState := r.URL.Path[len(r.URL.Path)-2:len(r.URL.Path)]
		
		getUrl := url;
		getUrl += inputState + "/current.json";

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

		var jsonReps ProPublica_Members;

		err_2 := json.Unmarshal(body, &jsonReps)
		if err_2 != nil {
			log.Printf("Error: %v", err_2);
			http.Error(w, err.Error(), 500);
			return;
		}

		// Send state reps information response in JSON
		w.Header().Set("Content-Type", "application/json");
		w.Header().Set("X-API-Key", credsData.ProPublica_API_Key);
		json.NewEncoder(w).Encode(jsonReps);
	}
}

func serveFederalStateMemberInfo(url string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Query parameters
		inputMemberId := r.URL.Path[len(r.URL.Path)-7:len(r.URL.Path)]
		
		getUrl := url;
		getUrl += inputState + "json";

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

		var jsonReps ProPublica_Member;

		err_2 := json.Unmarshal(body, &jsonReps)
		if err_2 != nil {
			log.Printf("Error: %v", err_2);
			http.Error(w, err.Error(), 500);
			return;
		}

		// Send state reps information response in JSON
		w.Header().Set("Content-Type", "application/json");
		w.Header().Set("X-API-Key", credsData.ProPublica_API_Key);
		json.NewEncoder(w).Encode(jsonReps);
	}
}
	

// Serve JSON
func serveLocalStateInfo(url string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		inputState := r.URL.Path[len(r.URL.Path)-2:len(r.URL.Path)]
		
		getUrl := url;
		getUrl += "&state=" + inputState;

		//log.Println("Sending this GET request to OpenStates API: " + getUrl);

		
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

		//log.Printf("Response from OpenStates API: %s", body)
		var jsonReps []OpenStates_Official;
		err_2 := json.Unmarshal(body, &jsonReps)
		if err_2 != nil {
			log.Printf("Error: %v", err_2);
			http.Error(w, err.Error(), 500);
			return;
		}

		jsonReps.state = inputState;

		// Send state reps information response in JSON
		w.Header().Set("Content-Type", "application/json");
		json.NewEncoder(w).Encode(jsonReps);
		
	}
}

// Serve HTML
func serveHome(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./public" + r.URL.Path)
}

func readCredentials(input string) Creds {
	raw, err := ioutil.ReadFile(input);
	if (err != nil) {
		fmt.Println(err.Error());
		os.Exit(1);
	}

	var c Creds
	json.Unmarshal(raw, &c)
	return c
}

func main() {
	os.Setenv("PORT", "8080");

	// IMPORTANT NOTE: All Credentials (API Key, user, pw) are read from a file './Creds.txt'
	// You will have to create you own with the following text:
	/*
		{
			"ProPublica API Key": "[Insert ProPublica key here]"
		}
	*/
	credsData := readCredentials("./Creds.txt");

	// Serve Home
	http.HandleFunc("/", serveHome)

	// Serve state information
	http.HandleFunc("senate/", serveFederalStateInfo("https://api.propublica.org/congress/v1/members/"))
	http.HandleFunc("house/", serveFederalStateInfo("https://api.propublica.org/congress/v1/members/"))
	http.HandleFunc("member/", serveFederalStateMemberInfo("https://api.propublica.org/congress/v1/members/"));

	// Serve local info
	http.HandleFunc("/senators/state/", serveLocalStateInfo("https://openstates.org/api/v1/legislators/?active=true&chamber=upper"))
	http.HandleFunc("/representatives/state/", serveLocalStateInfo("https://openstates.org/api/v1/legislators/?active=true&chamber=lower"))

	http.ListenAndServe(":" + os.Getenv("PORT"), nil)
}
