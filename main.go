package main

import (
	"encoding/xml"
	//"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

type Senate struct {
	Members []Senator `xml:"member"`
}

type Senator struct {
	XMLName     xml.Name `xml:"member"`
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
	Bioguide_id string   `xml:"bioguide_id"`
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	//log.Println(r.URL.Path);
	//t := template.New("template");
	//t, _ = t.ParseFile("/views/home.html")

	http.ServeFile(w, r, "."+r.URL.Path)
}

func serveSenateInfo(w http.ResponseWriter, r *http.Request) {
	log.Println("Got request for state info: " + r.URL.Path)


	resp, err := http.Get("http://www.senate.gov/general/contact_information/senators_cfm.xml")

	if err != nil {
		log.Println(err.Error())
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err.Error())
		return
	}

	var xmlSenate Senate
	err_2 := xml.Unmarshal(body, &xmlSenate)
	if err_2 != nil {
		log.Printf("Error: %v", err_2)
		return
	}

	inputState := r.URL.Path[len(r.URL.Path)-2:len(r.URL.Path)]
	ilSenators := findSenatorsByState(inputState, xmlSenate);
	log.Println(inputState + " Senator 1: " + ilSenators[0].First_name + " " + ilSenators[0].Last_name);
	log.Println(inputState + " Senator 2: " + ilSenators[1].First_name + " " + ilSenators[1].Last_name);
}

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

	http.ListenAndServe(":8080", nil)
}
