import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        ignores: ['src/bml/__tests__/interpreter.test.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
    },
    {
        files: ['**/*.cjs', '**/*.js'],
        languageOptions: {
            globals: {
                module: 'readonly',
                console: 'readonly',
                require: 'readonly',
                exports: 'readonly',
            },
        },
    },
];
