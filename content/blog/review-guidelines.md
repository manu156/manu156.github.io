---
external: false
title: "Code Review Guidelines"
description: "My Checklist when doing a code review for a pull request"
date: 2023-11-28
---
This is my check list that so that I do not miss anything while doing a code review.  
I made this list based on my experience trying to make out patterns out of bugs that I have seen frequently.
# General Guidlines
- Don't implement things that you might need in the future but are not required now
- Comments are clear and useful, and mostly explain why instead of what
- Any parallel programming is done safely. Shared fields or Dependency injection can cause data corruption
- Tests are well-designed. Write tests that test the each path when there are complex pathways
- Controller methods should have atleast one unique log
- Jobs should have logs at start and end of jobs code
- External system dependencies are properly treated
    - Data Storage Changes
        - Check code interactions with these systems for example in Java/Spring @Table/@Column can be used to identify these changes. These are to be properly documented and they might require thier own work like adding indices/mappings
        - Check if any data migration is needed aftet the changes
	- New APIs
        - Check ping and whitelisting on LBs
        - Add timeout and latency settings
	    - Add to monitoring graphs / alerts
    - Message Queue Systems
        - Add logs at both ends to debug problems, it is possible for some messages to be dropped at either producer or broker or consumer.
# Common Bug Patterns
- .get(0) or array[0] is likely to cause bugs when multiple entries are present or no entries are present
	use clear names for everything. Similar Names for things that represent different things. Confusing names can lead to bugs
- A method should do only one thing and should have correct name
- It is possible that a method has it's wrong name for example, a method validating user which returns true when user is valid might have return opposite value instead
- Utility methods may have different behaviour than expected for example a utility method to convert list to set/map might throw an exception when duplicates are encountered or silently replace duplicates in order,.. 