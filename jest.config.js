export default {
  displayName: "frontend",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/__test__/**/*.test.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};