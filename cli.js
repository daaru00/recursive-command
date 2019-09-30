#!/usr/bin/env node
const consola = require('consola')

const argv = require('minimist')(process.argv.slice(2))
const Finder = require('./lib/finder')
const Executor = require('./lib/executor')

const fileToFind = argv['find-file']
if (fileToFind === undefined) {
  consola.error('Required argument "find-file" not found, ex: "<executable> --find-file=package.json <command>"')
  return
}
const parallel = argv.parallel || false
const directory = argv['find-in-directory'] || process.cwd()

const originalCommand = process.argv.slice(2).join(' ')
  .replace(`--find-file=${fileToFind} `, '')
  .replace(`--find-file="${fileToFind}" `, '')
  .replace(`--find-file='${fileToFind}' `, '')
  .replace(`--find-file ${fileToFind} `, '')
  .replace(`--find-in-directory=${directory} `, '')
  .replace(`--find-in-directory="${directory}" `, '')
  .replace(`--find-in-directory='${directory}' `, '')
  .replace(`--find-in-directory ${directory} `, '')
  .replace('--parallel ', '')

const main = async () => {  
  const finder = new Finder(fileToFind, directory)
  const paths = await finder.findDirectories(fileToFind)
  if (paths.length === 0) {
    consola.error(`No file "${fileToFind}" found`)
    return
  }
  
  const executor = new Executor()
  try {
    if (parallel) {
      await executor.executeParallel(originalCommand, paths)
    } else {
      await executor.executeSequentially(originalCommand, paths).catch((error) => {
        consola.error('Execution error: ' + error.message)    
      })
    }
  } catch (error) {
    consola.error('Execution error: ' + error.message)
  }
}

main()

