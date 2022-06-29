import chalk from 'chalk'
import { spawn } from 'child_process'
import Listr = require('listr')
import parseArgsStringToArgv from 'string-argv'
import { IxyTaskNotFoundError } from './errors'
import { IxyFile } from './IxyFile'

/**
 * Ixy class.
 */
export class Ixy {
  constructor(private readonly program: IxyFile) {}

  async run(taskName: string) {
    const task = this.getTaskByName(taskName)
    const listrTasks: Listr.ListrTask[] = []

    for (const job of task.jobs) {
      listrTasks.push({
        title: job.name,
        async task(_, t) {
          const [cmd, ...args] = parseArgsStringToArgv(job.run)
          const process = spawn(cmd, args)
          const start = Date.now()
          let output = ''

          let id = setInterval(() => {
            t.title = `${job.name} (${Date.now() - start}ms)`
            t.output = `${output}`
          }, 10)

          process.stdout.on('data', (data) => {
            output = data
          })

          const promise = new Promise((resolve, reject) => {
            process.on('exit', resolve)
            process.on('error', reject)
          })

          promise.finally(() => {
            clearInterval(id)
          })

          return promise
        },
      })
    }

    const listr = new Listr(listrTasks)
    await listr.run()
  }

  private getTaskByName(taskName: string) {
    if (this.program.tasks[taskName]) {
      return this.program.tasks[taskName]
    }

    throw new IxyTaskNotFoundError(taskName)
  }
}
