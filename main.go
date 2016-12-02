package main

import (
	"net/http"
	"log"
)

func serveHome(w http.ResponseWriter, r *http.Request) {
	//log.Println(r.URL.Path);
	//t := template.New("template");
	//t, _ = t.ParseFile("/views/home.html")
	
	http.ServeFile(w, r, "." + r.URL.Path);
}

func serveStateInfo(w http.ResponseWriter, r *http.Request) {
	log.Println("Got request for state info: " + r.URL.Path);
}

func main() {
	// Serve Home
	http.HandleFunc("/", serveHome);

	// Serve state information
	http.HandleFunc("/states/", serveStateInfo);

 	http.ListenAndServe(":8080", nil);
}