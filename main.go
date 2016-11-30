package main

import (
	"net/http"
	"io/ioutil"
	"log"
	"strings"
)

type Router struct {
}

func (this *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path[1:];
	log.Println("Requested Path: " + path);

	data, error := ioutil.ReadFile(string(path));

	if (error == nil) {
		var contentType string;

		// Set proper contant type for requested resource
		if (strings.HasSuffix(path, ".css")) {
			contentType = "text/css";
			log.Println("Serving css...");
		} else if (strings.HasSuffix(path, ".html")) {
			contentType = "text/html";
		} else if (strings.HasSuffix(path, ".js")) {
			contentType = "application/js";
		} else if (strings.HasSuffix(path, ".png") || strings.HasSuffix(path, ".jpg")) {
			contentType = "image";
		} else {
			contentType = "text/plain";
		}

		w.Header().Add("Content-Type", contentType);
		w.Write(data);
	} else {
		w.WriteHeader(404);
		w.Write([]byte("HTTP 404 Error: " + http.StatusText(404)));
	}
}

func main() {
	http.Handle("/", new(Router));
 	http.ListenAndServe(":8080", nil);
}