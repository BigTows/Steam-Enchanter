module.exports = {
    roots: ["src"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: ['text', 'cobertura'],
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!<rootDir>/node_modules/"
    ],
}; 
