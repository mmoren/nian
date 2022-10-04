package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"sort"
	"strings"
	"time"

	"github.com/gorilla/handlers"
	"gitlab.com/maxmoren/nian/lexin"
)

var wordClasses = map[string]interface{}{
	"subst.":  struct{}{},
	"adj.":    struct{}{},
	"verb":    struct{}{},
	"adv.":    struct{}{},
	"räkn.":   struct{}{},
	"interj.": struct{}{},
	"pron.":   struct{}{},
}

type Word struct {
	Form string   `json:"form"`
	Pos  string   `json:"pos"`
	Defs []string `json:"defs"`
}

var numberSuffix = regexp.MustCompile(" [0-9]+$")

func getDefs(le lexin.LemmaEntry) []string {
	var defs []string
	for _, lexeme := range le.Lexemes {
		if lexeme.Definition != "" {
			defs = append(defs, lexeme.Definition)
		}
	}
	return defs
}

func filter(l *lexin.Lexin, min, max int) []Word {
	var out []Word

	for _, le := range l.LemmaEntries {
		if _, ok := wordClasses[le.Pos]; !ok {
			continue
		}

		form := strings.ReplaceAll(numberSuffix.ReplaceAllString(le.Form, ""), "~", "")

		if strings.ContainsAny(form, " -") {
			continue
		}

		if len([]rune(form)) < min || len([]rune(form)) > max {
			continue
		}

		out = append(out, Word{
			Form: form,
			Pos:  le.Pos,
			Defs: getDefs(le),
		})
	}

	return out
}

type board struct {
	Letters string `json:"letters"`
	Words   []Word `json:"words"`
}

var allBoards []board

func main() {
	generateBaseBoards()

	rand.Seed(time.Now().UnixMicro())

	var handler http.Handler
	handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")

		b := generateBoard()

		if err := json.NewEncoder(w).Encode(b); err != nil {
			http.Error(w, `{"error":"could not encode board as JSON"}`, http.StatusInternalServerError)
		}
	})
	handler = handlers.CORS(handlers.AllowedMethods([]string{"GET", "HEAD", "OPTIONS"}))(handler)

	http.ListenAndServe(":8080", handler)
}

func generateBaseBoards() {
	f, err := os.Open("LEXIN.xml")
	if err != nil {
		panic("open LEXIN.xml: " + err.Error())
	}
	defer f.Close()

	l, err := lexin.Parse(f)
	if err != nil {
		panic("parse: " + err.Error())
	}

	words := filter(l, 4, 9)
	wordsByKey := make(map[string][]Word)

	for _, w := range words {
		key := sortedChars(w.Form)
		wordsByKey[key] = append(wordsByKey[key], w)
	}

	nines := filter(l, 9, 9)
	for _, nine := range nines {
		var words []Word
		subsets := subsets(nine.Form)

		for _, ss := range subsets {
			if ws, ok := wordsByKey[ss]; ok {
				words = append(words, ws...)
			}
		}

		wordExists := make(map[string]struct{})
		var uniqueWords []Word
		for _, word := range words {
			if _, ok := wordExists[word.Form]; !ok {
				uniqueWords = append(uniqueWords, word)
				wordExists[word.Form] = struct{}{}
			}
		}

		allBoards = append(allBoards, board{
			Letters: nine.Form,
			Words:   uniqueWords,
		})
	}
}

func generateBoard() board {
	theBoard := allBoards[rand.Int()%len(allBoards)]
	letters := scramble(theBoard.Letters)
	center := ([]rune(letters))[4]

	var filteredWords []Word
	for _, word := range theBoard.Words {
		if strings.ContainsRune(word.Form, center) {
			filteredWords = append(filteredWords, word)
		}
	}

	return board{Letters: letters, Words: filteredWords}
}

func scramble(word string) string {
	runes := []rune(word)
	sort.Slice(runes, func(i, j int) bool { return (rand.Int() & 1) == 0 })
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
