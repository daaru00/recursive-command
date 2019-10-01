const { spawn } = require('child_process')
const consola = require('consola')
const os = require('os')

module.exports = class Executor {
  /**
   * Executor constructor
   * 
   * @param {*} options
   */
  constructor (options) {
    this.options = {
      executable: '/bin/sh',
      ...options
    }
  }

  /**
   * Execute command
   * 
   * @param {String} command 
   * @param {String} cwd 
   * @param {String} tag 
   */
  async execute(command, cwd, tag) {
    cwd = cwd || process.cwd()
    tag = tag || ''
    consola.info({
      type: tag,
      message: `Executing "${command}" into directory "${cwd}"..`
    })
    return new Promise((resolve, reject) => {
      let commandExecution = null 
      try {
        commandExecution = spawn(this.options.executable, ['-c', command], {
          cwd,
          env: this.options.env || process.env
        })
      } catch (error) {
        reject(error)
        return
      }
      
      commandExecution.on('error', (error) => {
        consola.error({
          type: tag,
          message: error
        })
        reject(error)
      })

      commandExecution.stdout.on('data', function (data) {
        data.toString().split(os.EOL).forEach(line => consola.log({
          type: tag,
          message: line + ' '
        }))
      })
      
      commandExecution.stderr.on('data', function (data) {
        data.toString().split(os.EOL).forEach(line => consola.log({
          type: tag,
          message: line + ' '
        }))
      })
      
      commandExecution.on('exit', function (code) {
        if (code === 0) {
          consola.success({
            type: tag,
            message: 'Command successfully executed!'
          })
          resolve()
        } else {
          reject(new Error(`Error executing "${command}" into directory "${cwd}"`))
        }
      })
    })
  }

  /**
   * Execute commands sequentially
   * 
   * @param {String} command
   * @param {String[]} cwds 
   */
  async executeSequentially(command, cwds) {
    for (let index = 0; index < cwds.length; index++) {
      await this.execute(command, cwds[index] || process.cwd(), index.toString())
    }
  }

  /**
   * Execute commands parallel
   * 
   * @param {String} command
   * @param {String[]} cwds 
   */
  async executeParallel(command, cwds) {
    const promises = []

    for (let index = 0; index < cwds.length; index++) {
      promises.push(this.execute(command, cwds[index] || process.cwd(), index.toString()))
    }

    await Promise.all(promises)
  }

}
