import { Command, Flags } from '@oclif/core'
import * as path from 'path'
import * as fs from 'fs/promises'
import { Ixy } from '../lib/Ixy/Ixy'
import { parseIxyYaml } from '../lib/Ixy/IxyFile'
import { IxyTaskNotFoundError } from '../lib/Ixy/errors'

export default class Run extends Command {
  static description = 'run jobs ixy file'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    file: Flags.string({
      default: 'ixy.yaml',
    }),
  }

  static args = [{ name: 'task' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Run)

    const filepath = path.resolve(process.cwd(), flags.file)

    const program = await fs.readFile(filepath, 'utf8')
    const ixyFile = parseIxyYaml(program)

    try {
      const ixy = new Ixy(ixyFile)

      await ixy.run(args.task)
    } catch (e) {
      if (e instanceof IxyTaskNotFoundError) {
        this.error(`task \`${e.taskName}\` not found`)
      } else {
        throw e
      }
    }
  }
}
