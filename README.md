# Recursive execute command in different directories

This tool act like a proxy to your command and execute it into every directories that contain a specific file.

## Getting Started

Install it globally to you system
```
npm install -g recursive-command
```

## Arguments

`--find-file` File to find (**required**)

`--parallel` Execute command in parallel (**optional**)

## Examples

Execute `npm install` inside all NodeJS projects directories:
```
recursive-command --find-file='package-lock.json' --parallel npm install
```

Execute `yarn install` inside all projects directories that use `yarn`:
```
recursive-command --find-file='yarn.lock' --parallel yarn install
```

Execute `serverless deploy` inside all Serverless Framework projects directories sequentially:
```
recursive-command --find-file='serverless.yml' serverless deploy
```
