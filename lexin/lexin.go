package lexin

import (
	"encoding/xml"
	"io"

	"golang.org/x/net/html/charset"
)

type Lexin struct {
	LemmaEntries []LemmaEntry `xml:"lemma-entry"`
}

type LemmaEntry struct {
	Form          string   `xml:"form"`
	Pronunciation string   `xml:"pronunciation"`
	Inflection    string   `xml:"inflection"`
	Pos           string   `xml:"pos"`
	Lexemes       []Lexeme `xml:"lexeme"`
}

type Lexeme struct {
	Lexnr          string `xml:"lexnr"`
	Definition     string `xml:"definition"`
	Usage          string `xml:"usage"`
	Comment        string `xml:"comment"`
	Valency        string `xml:"valency"`
	GrammatComm    string `xml:"grammat_comm"`
	DefinitionComm string `xml:"definition_comm"`
	Example        string `xml:"example"`
	Idiom          string `xml:"idiom"`
	Compound       string `xml:"compound"`
}

func Parse(r io.Reader) (*Lexin, error) {
	l := new(Lexin)
	dec := xml.NewDecoder(r)
	dec.CharsetReader = charset.NewReaderLabel
	if err := dec.Decode(l); err != nil {
		return l, err
	}
	return l, nil
}
