package main

import (
	"bufio"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"sort"
	"strings"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type Word struct {
	Form string   `json:"form"`
	Pos  string   `json:"pos"`
	Defs []string `json:"defs"`
}

var goodWord = regexp.MustCompile("^[a-zåäö]+$")

func filter(l []string, min, max int) []string {
	var out []string
	for _, word := range l {
		if len([]rune(word)) < min || len([]rune(word)) > max {
			continue
		}
		if !goodWord.MatchString(word) {
			continue
		}

		out = append(out, word)
	}
	return out
}

type board struct {
	Seed    string `json:"seed"`
	Letters string `json:"letters"`
	Words   []Word `json:"words"`
}

var allBoards []board

func main() {
	generateBaseBoards()

	rand.Seed(time.Now().UnixMicro())

	r := mux.NewRouter()

	frontendFS, _ := fs.Sub(frontend, "frontend/build")
	r.NotFoundHandler = http.FileServer(http.FS(frontendFS))

	r.Use(handlers.CORS(handlers.AllowedMethods([]string{"GET", "HEAD", "OPTIONS"})))

	r.HandleFunc("/boards/random", func(w http.ResponseWriter, r *http.Request) {
		seed := rand.Uint64()
		var seedBytes [8]byte
		binary.BigEndian.PutUint64(seedBytes[:], seed)
		seedString := base64.RawURLEncoding.EncodeToString(seedBytes[:])
		w.Header().Set("Location", fmt.Sprintf("/boards/%s", seedString))
		w.WriteHeader(http.StatusSeeOther)
	})

	r.HandleFunc("/boards/{seed}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		if seed, ok := mux.Vars(r)["seed"]; ok {
			seedBytes, err := base64.RawURLEncoding.DecodeString(seed)
			if err != nil {
				http.Error(w, `{"error":"invalid seed"}`, http.StatusNotFound)
			}
			seed := binary.BigEndian.Uint64(seedBytes)
			b := generateBoard(seed)

			w.Header().Set("Cache-Control", "max-age=86400, public, must-revalidate")
			if err := json.NewEncoder(w).Encode(b); err != nil {
				http.Error(w, `{"error":"could not encode board as JSON"}`, http.StatusInternalServerError)
			}
		} else {
			http.Error(w, `{"error":"invalid seed"}`, http.StatusNotFound)
		}
	})

	log.Println("ready")

	// Determine port for HTTP service.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("listening on port %s\n", port)

	http.ListenAndServe(":"+port, r)
}

func readLines(path string) ([]string, error) {
	file, err := wordlist.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return lines, scanner.Err()
}

func generateBaseBoards() {
	l, err := readLines("svenska-ord.txt/svenska-ord.txt")
	if err != nil {
		panic("readLines: " + err.Error())
	}

	words := filter(l, 4, 9)
	wordsByKey := make(map[string][]string)

	for _, w := range words {
		key := sortedChars(w)
		wordsByKey[key] = append(wordsByKey[key], w)
	}

	nines := filter(l, 9, 9)
	for _, nine := range nines {
		var words []string
		subsets := subsets(nine)

		for _, ss := range subsets {
			if ws, ok := wordsByKey[ss]; ok {
				words = append(words, ws...)
			}
		}

		wordExists := make(map[string]struct{})
		var uniqueWords []Word
		for _, word := range words {
			if _, ok := wordExists[word]; !ok {
				uniqueWords = append(uniqueWords, Word{Form: word})
				wordExists[word] = struct{}{}
			}
		}

		allBoards = append(allBoards, board{
			Letters: nine,
			Words:   uniqueWords,
		})
	}
}

func generateBoard(seed uint64) board {
	rnd := rand.New(rand.NewSource(int64(seed)))

	theBoard := allBoards[rnd.Int()%len(allBoards)]
	letters := scramble(rnd, theBoard.Letters)
	center := ([]rune(letters))[4]

	var filteredWords []Word
	for _, word := range theBoard.Words {
		if strings.ContainsRune(word.Form, center) {
			filteredWords = append(filteredWords, word)
		}
	}

	var seedBytes [8]byte
	binary.BigEndian.PutUint64(seedBytes[:], seed)
	seedString := base64.RawURLEncoding.EncodeToString(seedBytes[:])
	return board{
		Seed:    seedString,
		Letters: letters,
		Words:   filteredWords,
	}
}

func scramble(rnd *rand.Rand, word string) string {
	runes := []rune(word)
	sort.Slice(runes, func(i, j int) bool { return (rnd.Int() & 1) == 0 })
	return string(runes)
}

func sortedChars(word string) string {
	chars := []rune(word)
	sort.Slice(chars, func(i, j int) bool { return chars[i] < chars[j] })
	return string(chars)
}

func subsets(word string) []string {
	chars := []rune(sortedChars(word))
	var subset []string
	var recurse func(output []rune, index int)

	recurse = func(output []rune, index int) {
		// Base Condition
		if index == len(chars) {
			subset = append(subset, string(output))
			return
		}

		// Not Including Value which is at Index
		recurse(output, index+1)

		// Including Value which is at Index
		output = append(output, chars[index])

		recurse(output, index+1)
	}

	recurse(nil, 0)

	return subset
}
