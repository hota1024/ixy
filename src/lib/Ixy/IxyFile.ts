import * as YAML from 'yaml'

/**
 * Task type.
 */
export type Task = {
  /**
   * task name.
   */
  name: string

  /**
   * task jobs.
   */
  jobs: Job[]
}

/**
 * document
 */
export type Job = {
  /**
   * job name.
   */
  name: string

  /**
   * job command.
   */
  run: string
}

/**
 * IxyFile type.
 */
export type IxyFile = {
  tasks: {
    [key: string]: Task
  }
}

/**
 * IxyFileParser type.
 */
export type IxyFileParser = (program: string) => IxyFile

/**
 * parse ixy yaml format.
 *
 * @param program program.
 */
export const parseIxyYaml: IxyFileParser = (program) => {
  const ixyFile: IxyFile = YAML.parse(program)

  return ixyFile
}
