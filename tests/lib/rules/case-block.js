"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/case-block");

const ruleTester = new RuleTester();

ruleTester.run("case-block", rule, {
    valid: [
        {
            code: "switch (a) { case 1: { break; } default: { break; } }",
            parserOptions: { ecmaVersion: 6 },
        },
        {
            code: "switch (a) { case 1: case 2: { break; } }",
            parserOptions: { ecmaVersion: 6 },
        },
    ],
    invalid: [
        {
            code: "switch (a) { case 1: break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "SwitchCase" }],
        },
        {
            code: "switch (a) { case 1: { break; } break; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "SwitchCase" }],
        },
    ],
});
