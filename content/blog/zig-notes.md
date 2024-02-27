---
external: false
title: "Zig - Notes / CheatSheeet"
description: "Zig learning notes"
date: 2024-02-28
---

Basics:
Variables: var for mutable and const for immutable.
Type Inference: Types can be explicit or inferred.

Arrays:
Arrays are defined using const with specified elements or a length placeholder.
Access array size using .len.

Data Type Conversion:
Use @intCast and @floatCast for numeric conversions.
Use @intToFloat and @floatToInt for broader numeric transformations.

Data Types:
Integers, floating-point, boolean, characters, and strings are supported.
Loops and Control Statements:

While and for loops, if statements, switch statements, and a ternary operator.
Defer statement for executing code when exiting a block.

Functions:
Function declaration, invocation, parameters, and return values.
Void functions and function pointers.

Pointers:
Creating pointers, dereferencing, pointer arithmetic, and pointers in structs.
Null pointers are represented as null.

Error Handling:
Result type for explicit error handling.
Option type for optional values.
Custom error types.

Memory Management:
Explicit memory allocation and deallocation using an allocator.

Concurrency (Async/Await):
Zig supports asynchronous programming with async/await syntax.
