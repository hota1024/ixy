import * as dotenv from 'dotenv'
import * as fs from 'fs/promises'
import { spawn } from 'child_process'
import Listr = require('listr')
import parseArgsStringToArgv from 'string-argv'
import { IxyTaskNotFoundError } from './errors'
import { IxyFile, Task } from './IxyFile'

/**
 * Ixy class.
 */
export class Ixy {
  constructor(private readonly program: IxyFile) {}

  async run(taskName: string) {
    const env = await this.getEnv()
    const task = this.getTaskByName(taskName)

    const listr = new Listr([
      ...this.generateServers(task),
      ...this.generateJobs(task),
    ])
    await listr.run()
  }

  private generateServers(task: Task) {
    const tasks: Listr.ListrTask[] = []
    const servers = this.program.servers.filter((server) => {
      return (
        task.jobs.find((job) => job.scp?.server)?.scp?.server === server.name
      )
    })
    console.log(servers)

    for (const server of servers) {
      console.log(server)
      // tasks.push({
      //   title: server.name,
      //   task: async (ctx, task) => {
      //     task.title = `${server.name} (${server.host}:${server.port})`
      //     task.output = `${server.host}:${server.port}`
      //   },
      // })
    }

    return tasks
  }

  private generateJobs(task: Task): Listr.ListrTask[] {
    const listrTasks: Listr.ListrTask[] = []

    for (const job of task.jobs) {
      listrTasks.push({
        title: job.name,
        async task(_, t) {
          if (job.run) {
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
          }
        },
      })
    }

    return listrTasks
  }

  private async getEnv() {
    const env = new Map<string, any>()

    for (const envFilePath of this.program.env) {
      dotenv.config({ path: envFilePath })
    }

    for (const key of Object.keys(process.env)) {
      env.set(key, process.env[key])
    }

    return env
  }

  private getTaskByName(taskName: string) {
    if (this.program.tasks[taskName]) {
      return this.program.tasks[taskName]
    }

    throw new IxyTaskNotFoundError(taskName)
  }
}
