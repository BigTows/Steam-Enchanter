module.exports = {
    roots: ["src"],
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: ['text', 'cobertura'],
}; 
