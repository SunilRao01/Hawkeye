package main

import (
	"net/http"
	"io/ioutil"
	"log"
	"fmt"
)

func serveHome(w http.ResponseWriter, r *http.Request) {
	//log.Println(r.URL.Path);
	//t := template.New("template");
	//t, _ = t.ParseFile("/views/home.html")

	http.ServeFile(w, r, "." + r.URL.Path);
}

func serveStateInfo(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get("http://www.senate.gov/general/contact_information/senators_cfm.xml");

	if (err != nil) {
		log.Println("Error getting info!");
		return;
	}
	defer resp.Body.Close();

	body, err := ioutil.ReadAll(resp.Body);
	if (err != nil) {
		log.Println("Error reading response body!");
		return;
	}

	fmt.Printf("%s", body);

	log.Println("Got request for state info: " + r.URL.Path);
}

func main() {
	// Serve Home
	http.HandleFunc("/", serveHome);

	// Serve state information
	http.HandleFunc("/states/", serveStateInfo);

 	http.ListenAndServe(":8080", nil);
}