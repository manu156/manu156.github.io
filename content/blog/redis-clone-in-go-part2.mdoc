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

# Better Code
I have added a struct to maintain buffer
```go
type DataBuffer struct {
	Buffer      []byte  // Data read from client
	Size        int     // Size of data read from client in bytes
	ReadPointer int     // Number of bytes read/processed
}
``` 
Now my handleConnection is something like this
```go
func handleConnection(conn net.Conn) {
    // defer clouser of connection
	lastProcessed := true
	dataBuffer := DataBuffer{Buffer: make([]byte, BufferSize)}
	for {
		if lastProcessed {
			// read new data into buffer
            // ... code
		}

        // parse the command
		commandArray, err := readCommand(conn, &dataBuffer)
		if err {
			return
		}

        // proccess and reply to client
		if processCommand(conn, commandArray) {
			return
		}

		if dataBuffer.ReadPointer < dataBuffer.Size {
            // If some data is left in buffer probably another command then process it in next iteration
			lastProcessed = false
			// ... more code
		}
	}
}
```
And for readCommand, I really wanted to use the size provided in front of each datatype in parsing. I tried to read the size of command/argument first then I can read atleast this "size" amount of data to completely obtain next argument. (MaxReadIterations is just for a safety-check so that we never end up in a loop because of some error)
```go
func readCommand(conn net.Conn, dataBuffer *DataBuffer) ([]string, bool) {
    // get the size of array
	arraySize, err := getDataSize(conn, dataBuffer)
	if err || 0 == arraySize || arraySize > MaxArgumentSize {
		return nil, true
	}

	cmdArray := make([]string, arraySize)
	for arrayCounter := 0; arrayCounter < arraySize; arrayCounter++ {
        // get the size of argument
		argSize, getDataSizeErr := getDataSize(conn, dataBuffer)
		if getDataSizeErr || 0 == argSize {
			return nil, true
		}

		for iter := 0; iter <= MaxReadIterations; iter++ {
            // If there is enough data in buffer to competely parse this argument then proceed else read more data
			if dataBuffer.Size >= dataBuffer.ReadPointer+argSize+2 {
				break
			}
			err = readDataIntoBuffer(conn, dataBuffer, true)
			if err {
				return nil, true
			}
		}
		cmdArray[arrayCounter] = string((dataBuffer.Buffer)[dataBuffer.ReadPointer : dataBuffer.ReadPointer+argSize])
		dataBuffer.ReadPointer += argSize + 2
	}
	return cmdArray, false
}
```
Remaining is just imperative code stuff. Now we can easily parse our commands something like this
```go
func processCommand(conn net.Conn, cmdArray []string) bool {
	if strings.ToLower(cmdArray[0]) == "ping" {
		_, err := conn.Write([]byte("+PONG\r\n"))
		if nil != err {
			fmt.Println("error while pinging.", err)
			return true
		}
	} else {
		_, err := conn.Write([]byte("-1\r\n"))
		if nil != err {
			fmt.Println("error while pinging.", err)
			return true
		}
	}
	return false
}
```
Finally our code is much better and we can write code for each command (in the next blog ofc &#128517;).