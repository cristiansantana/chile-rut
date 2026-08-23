import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    transform: {
        "^.+.ts$": "ts-jest",
    },
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
};

export default config;
