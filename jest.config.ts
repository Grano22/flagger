import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    modulePaths: ['<rootDir>/src/'],
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    //testRegex: '(/tests/.*|(\\\\.|/)(test|spec))\\\\.[jt]sx?$',
    testMatch: ['<rootDir>/tests/**/*.(test).{js,jsx,ts,tsx}'],
    preset: 'ts-jest',
    testEnvironment: 'jsdom'
};

export default config;