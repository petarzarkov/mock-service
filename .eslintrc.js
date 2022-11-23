module.exports = {
    ...require("@draftkings/casino-lint-configs").getEslint({
        rules: {
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/indent": ["warn", 4],
        }
    }),
    parserOptions: {
        sourceType: 'module',
        project: ["./tsconfig.json"]
    },
    ignorePatterns: ['**/*.js', '**/*.d.ts', 'node_modules', 'dist', 'tests', '**/*.md', '**/*.json', "coverage", "scripts", "**/*.spec.ts"],
    root: true,
    env: {
        node: true,
    }
};
