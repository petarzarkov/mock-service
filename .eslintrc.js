module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/eslint-recommended", "plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking"],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: ["./tsconfig.json"],
    },
    ignorePatterns: ["**/*.js", "**/*.d.ts", "node_modules", "build", "tests", "**/*.md", "**/*.json", "..*"],
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/indent": "warn",
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                multiline: {
                    delimiter: "semi",
                    requireLast: true,
                },
                singleline: {
                    delimiter: "semi",
                    requireLast: false,
                },
            },
        ],
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/quotes": ["warn", "double"],
        "@typescript-eslint/semi": ["warn", "always"],
        "brace-style": ["warn", "1tbs"],
        curly: ["warn", "multi-line"],
        "max-len": [
            "error",
            {
                code: 200,
            },
        ],
        "no-caller": "warn",
        "no-constant-condition": "warn",
        "no-control-regex": "warn",
        "no-eval": "error",
        "no-extra-semi": "error",
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": "warn",
        "no-multiple-empty-lines": [
            "warn",
            {
                max: 1,
            },
        ],
        "no-octal": "warn",
        "no-octal-escape": "warn",
        "no-regex-spaces": "warn",
        "no-restricted-syntax": ["error", "ForInStatement"],
        "no-trailing-spaces": "warn",
        "@typescript-eslint/no-empty-interface": [
            "error",
            {
                allowSingleExtends: true,
            },
        ],
    },
};
