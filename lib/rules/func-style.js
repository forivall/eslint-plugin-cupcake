/**
 * @fileoverview Rule to enforce a particular function style
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const validParent = new Set([
    "Program",
    "StaticBlock",
    "ExportNamedDeclaration",
    "ExportDefaultDeclaration",
]);
const validBlockStatementParent = new Set([
    "FunctionDeclaration",
    "FunctionExpression",
    "ArrowFunctionExpression",
]);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description:
                "Enforce the consistent use of either `function` declarations or expressions",
            category: "Stylistic Issues",

            recommended: true,
            url: "https://github.com/forivall/eslint-plugin-cupcake/blob/main/docs/rules/func-style.md",
        },

        schema: [
            {
                enum: ["declaration", "expression"],
            },
            {
                type: "object",
                properties: {
                    allowArrowFunctions: {
                        type: "boolean",
                        default: false,
                    },
                    allowInnerExpressions: {
                        type: ["boolean", "null"],
                        default: null,
                    },
                },
                additionalProperties: false,
            },
        ],

        messages: {
            expression: "Expected a function expression.",
            declaration: "Expected a function declaration.",
            declarationOrArrow:
                "Expected a function declaration or arrow function expression.",
        },
    },

    create(context) {
        const style = context.options[0],
            allowArrowFunctions =
                context.options[1] && context.options[1].allowArrowFunctions,
            allowInnerExpressionsOption =
                context.options[1] && context.options[1].allowInnerExpressions,
            allowInnerExpressions =
                typeof allowInnerExpressionsOption === "boolean"
                    ? allowInnerExpressionsOption
                    : allowArrowFunctions,
            enforceDeclarations = style === "declaration",
            stack = [];

        /** @type {import('eslint').Rule.RuleListener} */
        const nodesToCheck = {
            FunctionDeclaration(node) {
                stack.push(false);

                if (
                    !enforceDeclarations &&
                    node.parent.type !== "ExportDefaultDeclaration"
                ) {
                    context.report({ node, messageId: "expression" });
                }
            },
            "FunctionDeclaration:exit"() {
                stack.pop();
            },

            FunctionExpression() {
                stack.push(false);
            },
            "FunctionExpression:exit"(node) {
                const hasThisExpr = stack.pop();

                const parent = node.parent;

                if (!enforceDeclarations) {
                    return;
                }

                if (
                    allowInnerExpressions &&
                    (!allowArrowFunctions || hasThisExpr)
                ) {
                    if (
                        parent.type === "BlockStatement" &&
                        !validBlockStatementParent.has(parent.parent.type)
                    ) {
                        return;
                    }

                    if (!validParent.has(parent.type)) {
                        return;
                    }
                }

                if (parent.type === "VariableDeclarator") {
                    context.report({
                        node: parent,
                        messageId: allowArrowFunctions
                            ? "declarationOrArrow"
                            : "declaration",
                    });
                }
            },

            ThisExpression() {
                if (stack.length > 0) {
                    stack[stack.length - 1] = true;
                }
            },
        };

        if (!allowArrowFunctions) {
            nodesToCheck.ArrowFunctionExpression = function () {
                stack.push(false);
            };

            nodesToCheck["ArrowFunctionExpression:exit"] = function (node) {
                const hasThisExpr = stack.pop();

                if (
                    enforceDeclarations &&
                    !hasThisExpr &&
                    node.parent.type === "VariableDeclarator"
                ) {
                    context.report({
                        node: node.parent,
                        messageId: "declaration",
                    });
                }
            };
        }

        return nodesToCheck;
    },
};
