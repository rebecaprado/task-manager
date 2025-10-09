import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^utils/(.*)$': '<rootDir>/src/_shared/utils/$1',
    '^schemas/(.*)$': '<rootDir>/src/_shared/schemas/$1',
    '^taskmanager/(.*)$': '<rootDir>/src/features/TaskManager/$1',
    '^authstore/(.*)$': '<rootDir>/src/features/Auth/store/$1',
    '^profile/(.*)$': '<rootDir>/src/features/Profile/$1',
    '^ui/(.*)$': '<rootDir>/src/_shared/components/ui/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
