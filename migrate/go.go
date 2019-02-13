package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"path"
	"strings"
)

var rules = []interface{}{}

func main() {
	// read file
	data, err := ioutil.ReadFile("./conf.json")
	if err != nil {
		fmt.Print(err)
	}

	var result map[string]interface{}
	json.Unmarshal([]byte(data), &result)

	srcDir := result["srcDir"].(string)
	rules = result["replace"].([]interface{})
	fmt.Println(rules)

	files, err := ioutil.ReadDir(srcDir)
	if err != nil {
		log.Fatal(err)
	}

	for _, file := range files {
		filePath := path.Join(srcDir, file.Name())
		// fmt.Println(filePath)
		content, err := ioutil.ReadFile(filePath)
		if err != nil {
			fmt.Print(err)
		}

		lines := strings.Split(string(content), "\n")
		if lines[0] == "---" {
			continue
		}

		lines = append(lines[:0], append([]string{"---"}, lines[0:]...)...)
		// fmt.Println(len(lines))
		// lines[0] = "xx"
		transform(lines)

		text := strings.Join(lines, "\n")
		// fmt.Println(lines[3])
		// fmt.Println(text)
		ioutil.WriteFile(filePath, []byte(text), 0644)

		fmt.Println(file.Name())
	}

	fmt.Println("End")
}

func transform(lines []string) {
	for l, line := range lines {
		for _, rule := range rules {
			r := rule.(map[string]interface{})
			from, ok := r["from"].(string)
			if !ok {
				fmt.Println("err")
			}
			if line == from {
				to, ok := r["to"].(string)
				if !ok {
					fmt.Println("err")
				}
				lines[l] = to
			}
		}
	}
}
