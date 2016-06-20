[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# udias CLI

Commandline interface for the [udias](http://udias.online) platform.


Checkout the live version: http://udias.online

## Getting Started

Install the tool globaly to access it directly through a terminal.

`npm install -g udias-cli`

Afterwards you can use the following commands:

```sh
udias types                 # list available task types
udias request               # create a new task as a suppliant
udias response <inforHash>  # process an existing task as a patron
```

Otherwise you can omit a parameter to open the help menu.

## Setup

Use `npm install` to load all dependencies.

### Development

Run `node build` to create and run the application on your local system.

### Production

Run `npm run build && npm run start` to create and run the application on your local system.
