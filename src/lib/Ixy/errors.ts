/**
 * IxyTaskNotFoundError class.
 */
export class IxyTaskNotFoundError extends Error {
  constructor(public readonly taskName: string) {
    super(`task \`${taskName}\` not found`)
  }
}
