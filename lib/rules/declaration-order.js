"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        docs: {
            description: "Enforces order of variable declarations",

            category: "Stylistic Issues",

            recommended: true,
            url: "https://github.com/forivall/eslint-plugin-cupcake/blob/main/docs/rules/case-block.md",
        },

        fixable: null,
        messages: {
            order: "Expected '{{thisKind}}' declarations to be before '{{prevKind}}'.",
        },
        schema: [
            {
                type: "array",
                minLength: 2,
                items: {
                    enum: ["var", "let", "const"],
                },
                default: ["const", "let"],
            },
        ],

        // TODO: choose the rule type.
        type: "suggestion",
    },

    create(context) {
        /** @type {Record<import('estree').VariableDeclaration['kind'], number>} */
        const order = (context.options[0] || ["const", "let"]).reduce(
            (o, type, i) => {
                o[type] = i;
                return o;
            },
            {}
        );

        /** @type {import('estree').VariableDeclaration[][]} */
        const stack = [];

        /**
         * Makes a block scope.
         * @returns {void}
         */
        function enterScope() {
            stack.push([]);
        }

        /**
         * Pops the last block scope.
         * @returns {void}
         */
        function exitScope() {
            stack.pop();
        }

        return {
            Program: enterScope,
            BlockStatement: enterScope,
            "BlockStatement:exit": exitScope,
            ForStatement: enterScope,
            "ForStatement:exit": exitScope,
            ForInStatement: enterScope,
            "ForInStatement:exit": exitScope,
            ForOfStatement: enterScope,
            "ForOfStatement:exit": exitScope,
            SwitchStatement: enterScope,
            "SwitchStatement:exit": exitScope,
            CatchClause: enterScope,
            "CatchClause:exit": exitScope,
            StaticBlock: enterScope,
            "StaticBlock:exit": exitScope,

            VariableDeclaration(node) {
                const currentScope = stack[stack.length - 1];

                currentScope.push(node);

                const thisOrder = order[node.kind];

                if (typeof thisOrder !== "number") {
                    return;
                }

                const prevDeclarations = [];

                for (let i = currentScope.length - 2; i >= 0; --i) {
                    const declaration = currentScope[i];
                    const prevOrder = order[declaration.kind];
                    const isPrevOrdered = typeof prevOrder === "number";

                    if (isPrevOrdered && prevOrder <= thisOrder) {
                        return;
                    }
                    prevDeclarations.unshift(declaration);
                    if (isPrevOrdered) {
                        break;
                    }
                }

                if (
                    !prevDeclarations.length ||
                    typeof order[prevDeclarations[0].kind] !== "number"
                ) {
                    return;
                }

                // Check if variables that we want to move ahead of are used in this declarators
                if (node.declarations.some((decl) => decl.init)) {
                    for (const declaration of prevDeclarations) {
                        const variables =
                            context.getDeclaredVariables(declaration);

                        for (const variable of variables) {
                            for (const reference of variable.references) {
                                const idRange = reference.identifier.range;

                                if (
                                    idRange[0] >= node.range[0] &&
                                    idRange[1] <= node.range[1]
                                ) {
                                    return;
                                }
                            }
                        }
                    }
                }

                const prev = prevDeclarations[0];

                context.report({
                    node,
                    messageId: "order",
                    data: {
                        thisKind: node.kind,
                        prevKind: prev.kind,
                    },
                });
            },
        };
    },
};
