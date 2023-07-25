---
external: false
title: "Making A Redis Clone For Learning Go - Part 1"
description: "This includes my process of building redis clone to learn Go"
date: 2023-07-15
---

Learning a programming language while doing a project would be much easier than simply learning the syntax or taking long courses and making notes. So this is my attempt at learning Go while creating a redis clone.

*Note:* I'll ignore error handling in most of the cases while including code here(even if go compiler doesn't like it), however the full code with better error handling is in my repo: [manu156/redisClone](https://github.com/manu156/redisClone)

## Zeroth Step

First things first. I need to have some documentation about redis and some method to test my clone.  
Going through redis documentation, it seems that there is enough material for initial coding. And for initial testing I will use some redis-client(probably redis-cli becacuse it's easy) to execute the commands and check, later automated tests/scripts can be added. So the plan for now is to implement a serever which will accept a single command, execute it and will return appropriate response.

## First Step

From the documentation:
> The first thing to do in order to check if Redis is working properly is sending a PING command using redis-cli
```sh
$ redis-cli ping
PONG
```
We got our first goal, to implement "ping". We also need to get redis-cli client without redis: (Download latest redis and unzip it)
```sh
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
```
Build redis-cli
```sh
make redis-cli
```
Then copy the binaries(`src/redis-cli`) to `/usr/local/bin`

## Implementation of First Step

First I'll we need to open a port on 6379 (redis default port). And we can handle each connection in a thread.

```go
l, err := net.Listen("tcp", "0.0.0.0:6379")

for {
    conn, err := l.Accept()
    if nil != err {
        fmt.Println("failed while accepting connection. ", err)
    }
    go handleConnection(conn)
}
```
For now, we dont know the format or payload so I'll just print the contents as it is
```go
func handleConnection(conn net.Conn) {
    b := make([]byte, 1024)
	
    size, err := conn.Read(b)
    if nil != err {
        fmt.Println("error while reading from connection.", err)
        return
    }

    println("got:", string(b))
}
```
Let's try running ping on redis-cli. Looks like redis-cli is starting but we got the following output from our server:
```RESP
*2
$7
COMMAND
$4
DOCS
```
Seems like the data is in some format. Going through redis documentation [redis docs](https://redis.io/docs/reference/protocol-spec/), we can see that this is RESP protocol.

Summary of the doc required for us ('cuz nobody likes to read documentation):
- Different parts of the protocol are always terminated with "\r\n" (CRLF).
- In RESP, the first byte determines the data type:
    - For Integers, the first byte of the reply is ":"
    - For Bulk Strings, the first byte of the reply is "$"
    - For Arrays, the first byte of the reply is "*"
- First byte is followed by number of bytes and CRLF

So now we can interpret the request something like [COMMAND, DOCS]. Probably client is requesting some information regarding documentation or commands, let's ignore this and try to respond for "PING" only. Our request for ping could be something like [PING], so we need to respond with "+PONG\r\n" in this case. "+" indicates the response is a simple string. Some hacky solution:
```go
if strings.Contains(strings.ToLower(string(b)), "ping") {
    _, err = conn.Write([]byte("+PONG\r\n"))
    if nil != err {
        fmt.Println("error while pinging.", err)
        return
    }
}
```
Running redis-cli:
```sh
❯ redis-cli
127.0.0.1:6379> ping
PONG
```
&#129395; cool It's working as expected  

Next Steps in part 2