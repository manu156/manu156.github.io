---
external: false
title: "Learnings From Data Compression Explained"
description: ""
date: 2023-12-10
---

Important points from the book

# Copyright Notice from original book
Copyright (C) 2010-2012, Dell, Inc. You are permitted to copy and distribute material from this book provided (1) any material you distribute includes this license, (2) the material is not modified, and (3) you do not charge a fee or require any other considerations for copies or for any works that incorporate material from this book. These restrictions do not apply to normal "fair use", defined as cited quotations totaling less than one page. This book may be downloaded without charge from http://mattmahoney.net/dc/dce.html.

# Notes
1.3. Modeling is Not Computable
We modeled the digits of π as uniformly distributed and independent. Given that model, Shannon's coding theorem places a hard limit on the best compression that could be achieved. However, it is possible to use a better model. The digits of π are not really random. The digits are only unknown until you compute them. An intelligent compressor might recognize the digits of π and encode it as a description meaning "the first million digits of pi", or as a program that reconstructs the data when run. With our previous model, the best we could do is (106 log2 10)/8 ≈ 415,241 bytes. Yet, there are very small programs that can output π, some as small as 52 bytes.

Solomonoff (1960, 1964), Kolmogorov (1965), and Chaitin (1966) independently proposed a universal a-priori probability distribution over strings based on their minimum description length. The algorithmic probability of a string x is defined as the fraction of random programs in some language L that output x, where each program M is weighted by 2-|M| and |M| is the length of M in bits. This probability is dominated by the shortest such program. We call this length the Kolmogorov complexity KL(x) of x.

Algorithmic probability and complexity of a string x depend on the choice of language L, but only by a constant that is independent of x. Suppose that M1 and M2 are encodings of x in languages L1 and L2 respectively. For example, if L1 is C++, then M1 would be a program in C++ that outputs x. If L2 is English, the M2 would be a description of x with just enough detail that it would allow you to write x exactly. Now it is possible for any pair of languages to write in one language a compiler or interpreter or rules for understanding the other language. For example, you could write a description of the C++ language in English so that you could (in theory) read any C++ program and predict its output by "running" it in your head. Conversely, you could (in theory) write a program in C++ that input an English language description and translated it into C++. The size of the language description or compiler does not depend on x in any way. Then for any description M1 in any language L1 of any x, it is possible to find a description M2 in any other language L2 of x by appending to M1 a fixed length description of L1 written in L2.