import Listr = require('listr')
import { IxyFile } from './IxyFile'

/**
 * Ixy class.
 */
export class Ixy {
  constructor(private readonly program: IxyFile) {}

  async run(taskName: string) {
    const task = this.getTaskByName(taskName)

    const listr = new Listr([])

    await listr.run()
  }

  private getTaskByName(taskName: string) {
    if (this.program.tasks[taskName]) {
      return this.program.tasks[taskName]
    }

    throw new Error(`task \`${taskName}\` not found`)
  }
}
