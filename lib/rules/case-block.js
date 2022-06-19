"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow lexical declarations in case clauses",
            recommended: true,
            url: "https://github.com/forivall/eslint-plugin-cupcake/blob/master/docs/rules/example-rule.md",
        },

        schema: [],

        messages: {
            unexpected: "Unexpected case block without braces.",
        },
    },

    create(context) {
        return {
            SwitchCase(node) {
                switch (node.consequent.length) {
                    case 0: {
                        break;
                    }
                    case 1: {
                        if (node.consequent[0].type === "BlockStatement") {
                            break;
                        }
                        // fallthrough
                    }
                    default: {
                        context.report({
                            node,
                            messageId: "unexpected",
                        });
                    }
                }
            },
        };
    },
};
