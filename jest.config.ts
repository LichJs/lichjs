import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  }
}
