### Basic Application Instructions

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
$ npm run start
OR
$ nest start -w
```

## Run tests

```bash
# unit tests
$ npm run test
```

# Notes:

I chose nest as it was an quick and easy way to standup a REST API with limited overhead

I chose to add middleware validation so I would not need to manually validate input other than adding the appropriate class-validator decorators, as this is what I would choose to do in a production setting

If I had more time:
- I would not mock the existing policies, but instead add a SQL DB for storage which I would then interface with in a data service layer.
- Move the helpers that currently live in the service, into a library, perhaps a PolicyUtil or MathUtil would be helpful for DRY.
- Move the 'findPolicies' to the aforementioned data service layer.
