export default {
    displayName: "backend",
    testEnvironment: "node",
    testMatch: ["<rootDir>/__test__/backend/*.test.js"],
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
  };