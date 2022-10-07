package main

import (
	"embed"
)

//go:embed all:frontend/build
var frontend embed.FS

//go:embed svenska-ord.txt/svenska-ord.txt
var wordlist embed.FS
