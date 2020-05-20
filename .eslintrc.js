module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-console": "off",
        "semi": "error",
        // 代码最大长度为100，且不限制注释最大长度
        "max-len": ["error", 100, 4, {
            "ignoreUrls": true,
            "ignoreComments": true,
            "ignoreRegExpLiterals": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true
        }],
        "@typescript-eslint/no-unused-vars": [
            "error"
        ]
    }
};
