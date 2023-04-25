"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/declaration-order");

const letConstErrors = [
    {
        messageId: "order",
        type: "VariableDeclaration",
        data: { thisKind: "const", prevKind: "let", prevVar: "b" },
    },
];

new RuleTester().run("declaration-order", rule, {
    valid: [
        { code: "const a = 1; let b;", parserOptions: { ecmaVersion: 6 } },
        {
            code: "const a = 1; var c; let b;",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "var c; const a = 1; let b;",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "const a = 1; let b; var c;",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "let b = 1; const a = b;",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "let b = 1; if (shouldThrow) { throw 'blah' } const a = 2;",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "function foo() { let b = 1; if (shouldReturn) { return 'blah' } const a = 2; }",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "labelled: { let b = 1; if (shouldBreak) { break labelled; } const a = 2; }",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "for(;;) { let b = 1; if (shouldContinue) { continue; } const a = 2; }",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "let b; const a = 1;",
            options: [["let", "const"]],
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "let b; const a = 1; var c",
            options: [["let", "const", "var"]],
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "const c = []; let b; c.push(b); const a = [...c]",
            parserOptions: { ecmaVersion: 6 },
        },
    ],
    invalid: [
        {
            code: "let b; const a = 1;",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
        {
            code: "let b; var c; const a = 1; ",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
        {
            code: "let b; let c; const a = 1; ",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
        {
            code: "var c; let b; const a = 1; ",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
        {
            code: "let b; const a = 1; var c;",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
        {
            code: "const a = 1; let b;",
            options: [["let", "const"]],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "order",
                    type: "VariableDeclaration",
                    data: { thisKind: "let", prevKind: "const", prevVar: "a" },
                },
            ],
        },
        {
            code: "var c; const a = 1; let b; ",
            options: [["let", "const", "var"]],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "order",
                    type: "VariableDeclaration",
                    data: { thisKind: "const", prevKind: "var", prevVar: "c" },
                },
                {
                    messageId: "order",
                    type: "VariableDeclaration",
                    data: { thisKind: "let", prevKind: "var", prevVar: "c" },
                },
            ],
        },
        {
            code: "let b = 1; function doThrow() { throw 'blah' } const a = 2;",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
        {
            code: "let b = 1; function foo() { if (shouldReturn) { return 'blah' } } const a = 2;",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
        {
            code: "let b = 1; labelled: { if (shouldBreak) { break labelled; } } const a = 2;",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
        {
            code: "let b = 1; for(;;) { if (shouldContinue) { continue; } } const a = 2;",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
        {
            code: "const c = []; let d; let b; c.push(d); const a = [...c]",
            parserOptions: { ecmaVersion: 6 },
            errors: letConstErrors,
        },
    ],
});
