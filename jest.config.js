/** @type {import('jest').Config} */
const config = {
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)",
        "<rootDir>/tests/**/[^_]*.[jt]s",
    ],
};

module.exports = config;
