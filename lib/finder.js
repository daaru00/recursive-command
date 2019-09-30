const find = require('find')
const { dirname } = require('path')
const consola = require('consola')
const _ = require('lodash')

module.exports = class Finder {

  /**
   * Finder constructor
   * 
   * @param {String} fileToFind 
   */
  constructor (fileToFind) {
    this.fileToFind = fileToFind
  }

  /**
   * Find files
   * 
   * @returns {String[]} files absolute path
   */
  async findFiles () {
    return new Promise((resolve, reject) => {
      find.file(new RegExp(this.fileToFind.replace('.', '\\.').replace('-', '\\-') + '$'), process.cwd(), (files) => {
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
