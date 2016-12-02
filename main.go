package main

import (
	"encoding/xml"
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

func serveStateInfo(w http.ResponseWriter, r *http.Request) {
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

	var s Senate
	err_2 := xml.Unmarshal(body, &s)
	if err_2 != nil {
		log.Printf("Error: %v", err_2)
		return
	}

	log.Println("Got request for state info: " + r.URL.Path)
	log.Println("Senator 1: " + s.Members[0].First_name + " " + s.Members[0].Last_name)
}

func main() {
	// Serve Home
	http.HandleFunc("/", serveHome)

	// Serve state information
	http.HandleFunc("/states/", serveStateInfo)

	http.ListenAndServe(":8080", nil)
}
