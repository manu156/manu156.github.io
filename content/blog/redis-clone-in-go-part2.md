---
external: false
title: "Making A Redis Clone For Learning Go - Part 2"
description: "This includes my process of building redis clone to learn Go"
date: 2023-07-20
---

Learning a programming language while doing a project would be much easier than simply learning the syntax or taking long courses and making notes. So this is my attempt at learning Go while creating a redis clone.

*Note:* I'll ignore error handling in most of the cases while including code here(even if go compiler doesn't like it), however the full code with better error handling is in my repo: [manu156/redisClone](https://github.com/manu156/redisClone)

Link to previous part: [Part 1](https://manu156.github.io/blog/redis-clone-in-go/)

## Parsing Commands

In the last part, we implemented some hackish way of parsing command "ping". Let's make it right.
My first attempt was to use Scanner from bufio something like this (code inspired from the functions in bufio):
```go
scanner := bufio.NewScanner(conn)
splitter := func(data []byte, atEOF bool) (advance int, token []byte, err error) {
    start := 0
    // Scan until space, marking end of word.
    for width, i := 0, start; i < len(data); i += width {
        var r rune
        r, width = utf8.DecodeRune(data[i:])
        if '\r' == r {
            rn, _ := utf8.DecodeRune(data[i+1:])
            if '\n' == rn {
                return i + width, data[start:i], nil
            }
        }
    }
    // If we're at EOF, we have a final, non-empty, non-terminated word. Return it.
    if atEOF && len(data) > start {
        return len(data), data[start:], nil
    }
    // Request more data.
    return start, nil, nil
}

for {
    // Set the split function for the scanning operation.
    scanner.Split(splitter)
    // Validate the input
    for scanner.Scan() {
        // first scan would be size of array. and next scans will scan command and it's arguments
        fmt.Printf("%s\n", scanner.Text())
    }
    // ... more code
}
```
The problem with this is we may not be able to parse large arguments so I thought to use conn.read() directly instead of wrapping it in some interface, it won't be neat though.
