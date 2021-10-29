# Regex-Worm

[The game](https://johannessattler.github.io/Regex-Worm/)

## Description

A game to learn regex in a fun way.

## MVP

- game will have a mission to select words with Regex
- Regex gets validated through test cases
- has a description that explains the mission and explains parts on how to use Regex
- Level based
- Has 2 worms that hold words. First worm holds words that should match second holds words that shouldnt match
- Achievements (level based)
- after a level x user can select flags (global...)

## Backlog

- add base HTML / CSS Layout
- Regex validator and test cases

## Data Structure

# main.js

- regexValidator()
- regexTestCases()
- levelSelector()

# worm.js

- class Worm {}
- constructor(words, wormType) 
- buildWormCanvas()
- wormAnimationRun()
- wormAnimationStop()

# levels.js

- holds all the levels ( Array of Objects )
- title
- test cases
- description
- Regex
- hints (optional)

## States

- level switch ( worm animation run outside and inside screen)
- Intro

## Task

- build HTML / CSS Layout
- connect to DOM
- main - Regex validator with test cases
- levels - build first template
- main - test case validator and go to next level after win

## Links

### Trello
[Trello board](https://trello.com/b/1bqxkOSl/regex-worm)

### Git
URls for the project repo and deploy
[Link Repo](https://github.com/JohannesSattler/Regex-Worm)
[Link Deploy](https://johannessattler.github.io/Regex-Worm/)

### Slides
URls for the project presentation (slides)

