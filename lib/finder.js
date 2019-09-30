const find = require('find')
const { dirname } = require('path')
const { existsSync, statSync } = require('fs')
const consola = require('consola')
const _ = require('lodash')

module.exports = class Finder {

  /**
   * Finder constructor
   * 
   * @param {String} fileToFind 
   * @param {String} directory 
   */
  constructor (fileToFind, directory) {
    this.fileToFind = fileToFind
    this.directory = directory || process.cwd()
  }

  /**
   * Find files
   * 
   * @returns {String[]} files absolute path
   */
  async findFiles () {
    if ( existsSync(this.directory) === false || statSync(this.directory).isDirectory() === false) {
      consola.error(`Directory ${this.directory} not found`)
      return []
    }
    return new Promise((resolve, reject) => {
      find.file(new RegExp(this.fileToFind.replace('.', '\\.').replace('-', '\\-') + '$'), this.directory, (files) => {
        resolve(files || [])
      }).error(reject)
    })
  }

  /**
   * Find directories
   * 
   * @returns {String[]} directories absolute path
   */
  async findDirectories () {
    const files = await this.findFiles()
    const dirs = _.uniq(files.map(dirname))
    consola.info(`Found ${files.length} files in ${dirs.length} directories`)
    files.forEach(file => consola.debug(file))
    return dirs
  }

}
