import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\.ts$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};

export default config;
