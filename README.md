This template is to be used when developing a Single Page Application connected to a REST Web API.This

There are two directories:

1. The **api** directory contains the code for the REST Web API.
2. The **spa** directory contains the front-end code.

Project settings: make sure **protect dynamic ports** is switched off.

# Getting Started

To run the system:

$ deno run --allow-all index.js
```

## Accounts

The system comes pre-configured with an account:

- username: `doej`
- password: `p455w0rd`

You can use the registration option to create more accounts.

The secure page allows you to upload files to the server, this will need to be replaced with the functionality required by your assigned topic.

## Linting

The Deno Lint tool only works for code written for Deno so in this assignment it should only be run on the contents of the `api/` directory.

The linter needs to load the settings from the config file so you need to run it using the following command:

```
$ deno lint --config deno.json
```
This template is designed to be installed inside a Codio box. To to this, open the terminal and run the following command:

```
$ curl -sL https://bit.ly/3ngLmVo | bash   --------this command is depre
```

This will configure the box ready for you to start development.

> The process can take up to 15 min. Make sure you don't close the browser tab _or let your computer go into sleep mode_.

To run the project:
