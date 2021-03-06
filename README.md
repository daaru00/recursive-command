# Recursive execute command in different directories

This tool act like a proxy to your command and execute it into every directories that contain a specific file.

## Getting Started

Install it globally to you system
```
npm install -g recursive-command
```

## Arguments

`--find-file` File to find (**required**)

`--find-in-directory` File files into specific directory (**optional**, default: current working directory)

`--limit` Raise and error when found files are more then limit, to disable it set to -1 (**optional**, default: 10)

`--parallel` Execute command in parallel (**optional**, default: command are runned sequentially)

`--ignore-errors` Ignore errors, exit code will be always 0 (**optional**, default: fail on first error with exit code 1)

## Examples

Execute `npm install` inside all NodeJS projects directories in parallel:
```
recursive-command --find-file='package-lock.json' --parallel npm install
```

Execute `yarn install` inside all sub-modules (directory `./modules`) that use `yarn`:
```
recursive-command --find-file='yarn.lock' --find-in-directory='./modules' --parallel yarn install
```

Execute `serverless deploy` inside all Serverless Framework projects directories sequentially:
```
recursive-command --find-file='serverless.yml' serverless deploy
```

Execute `npm audit` inside all NodeJS projects directories, ignoring errors:
```
recursive-command --find-file='package-lock.json' --parallel --ignore-errors npm audit 
```
