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
  run?: string
}

/**
 * Scp type.
 */
export type Server = {
  /**
   * name.
   */
  name: string

  /**
   * host.
   */
  host: string

  /**
   * port.
   */
  port?: number

  /**
   * username.
   */
  username: string

  /**
   * password.
   */
  password?: string

  /**
   * private key path.
   */
  privateKey?: string

  /**
   * passphrase.
   */
  passphrase?: string
}

/**
 * IxyFile type.
 */
export type IxyFile = {
  /**
   * env file paths.
   */
  env: string[]

  /**
   * server list.
   */
  servers: Server[]

  /**
   * tasks.
   */
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

  ixyFile.env = ixyFile.env || []
  ixyFile.tasks = ixyFile.tasks || {}

  return ixyFile
}
