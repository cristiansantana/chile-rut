import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    transform: {
        "^.+.ts$": "ts-jest",
    },
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
};

export default config;
