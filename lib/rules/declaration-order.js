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
            order: "Expected '{{thisKind}}' declarations to be before '{{prevKind}}' ({{prevVar}}).",
        },
        schema: [
            {
                type: "array",
                minLength: 2,
                items: {
                    enum: ["const", "let", "var"],
                },
                default: ["const", "let"],
            },
        ],

        // TODO: choose the rule type.
        type: "suggestion",
    },

    create(context) {
        /** @type {Array<import('estree').VariableDeclaration['kind']>} */
        const orderOption = context.options[0] || ["const", "let"];
        /** @type {Partial<Record<import('estree').VariableDeclaration['kind'], number>>} */
        const order = orderOption.reduce((o, type, i) => {
            o[type] = i;
            return o;
        }, {});

        /** @type {Array<{node: import('eslint').Rule.Node, declarations: import('estree').VariableDeclaration[]}>} */
        const stack = [];

        /**
         * Makes a block scope.
         * @param {import('eslint').Rule.Node} node AST node
         * @returns {void}
         */
        function enterScope(node) {
            stack.push({ node, declarations: [] });
        }

        /**
         * Pops the last block scope.
         * @returns {void}
         */
        function exitScope() {
            stack.pop();
        }

        /**
         * @template {import('estree').Node} T
         * @callback ResetScopeTest
         * @param {import('eslint').Rule.Node} node
         * @param {T} statement
         * @returns {boolean} if the check matches
         */

        /**
         * Reset scope test for unlabeled ContinueStatement or BreakStatement (non-switch)
         * @param {import('eslint').Rule.Node} node node to check
         * @returns {false | import('eslint').Rule.Node} If the test passed, the loop node
         */
        function getLoopNode(node) {
            if (node.type === "BlockStatement") {
                const parent = node.parent;

                return (
                    (parent.type === "WhileStatement" ||
                        parent.type === "DoWhileStatement") &&
                    parent
                );
            }
            return (
                (node.type === "ForStatement" ||
                    node.type === "ForInStatement" ||
                    node.type === "ForOfStatement") &&
                node
            );
        }

        /**
         * Check if the scope will end control from a return
         * @param {import('eslint').Rule.Node} node node to check
         * @returns {boolean} If the test passed
         */
        function isFunctionScope(node) {
            if (node.type === "StaticBlock") {
                return true;
            }
            if (node.type !== "BlockStatement") {
                return false;
            }
            const parentType = node.parent.type;

            return (
                parentType === "ArrowFunctionExpression" ||
                parentType === "FunctionDeclaration" ||
                parentType === "FunctionExpression"
            );
        }

        /**
         * Restart the block scope when control may exit.
         * @template {import('estree').Node} T
         * @param {ResetScopeTest<T>} test Check for when to stop walking up the stack
         * @returns {(node: T) => void} visitor function
         */
        function resetScope(test) {
            return function (node) {
                for (let i = stack.length - 1; i >= 0; i--) {
                    const current = stack[i];

                    current.declarations = [];
                    if (test(current.node, node)) {
                        break;
                    }
                }
            };
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
            ContinueStatement: resetScope((node, statement) => {
                const loopNode = getLoopNode(node);

                return (
                    loopNode &&
                    (!statement.label ||
                        (loopNode.parent.type === "LabeledStatement" &&
                            loopNode.parent.label.name ===
                                statement.label.name))
                );
            }),
            BreakStatement: resetScope((node, statement) => {
                if (statement.label) {
                    const candidate =
                        getLoopNode(node) ||
                        (node.type === "BlockStatement" &&
                            ((node.parent.type === "SwitchStatement" &&
                                node.parent) ||
                                node));

                    return (
                        candidate &&
                        candidate.parent.type === "LabeledStatement" &&
                        candidate.parent.label.name === statement.label.name
                    );
                }

                return !!(
                    getLoopNode(node) ||
                    (node.type === "BlockStatement" &&
                        node.parent.type === "SwitchStatement")
                );
            }),
            ReturnStatement: resetScope(isFunctionScope),
            ThrowStatement: resetScope(
                (node) =>
                    isFunctionScope(node) ||
                    (node.type === "BlockStatement" &&
                        node.parent.type === "TryStatement")
            ),

            VariableDeclaration(node) {
                const currentScope = stack[stack.length - 1];
                const { declarations } = currentScope;

                declarations.push(node);

                const thisOrder = order[node.kind];

                if (typeof thisOrder !== "number") {
                    return;
                }

                /** @type {typeof declarations} */
                const prevDeclarations = [];

                let i = declarations.length - 2;

                for (; i >= 0; --i) {
                    const declaration = declarations[i];
                    const prevOrder = order[declaration.kind];
                    const isPrevOrdered = typeof prevOrder === "number";

                    if (isPrevOrdered && prevOrder <= thisOrder) {
                        break;
                    }
                    prevDeclarations.unshift(declaration);
                }

                if (
                    !prevDeclarations.length ||
                    !prevDeclarations.find(
                        (declaration) =>
                            typeof order[declaration.kind] === "number"
                    )
                ) {
                    return;
                }

                // Check if variables that we want to move ahead of are used in this declarators
                if (node.declarations.some((decl) => decl.init)) {
                    /** @type {import('eslint').Scope.Variable[]} */
                    const prevVariables = [];

                    for (i; i >= 0; --i) {
                        const declaration = declarations[i];

                        prevVariables.push(
                            ...context.getDeclaredVariables(declaration)
                        );
                    }

                    let first = true;

                    // eslint-disable-next-line no-labels
                    decls: for (const declaration of prevDeclarations) {
                        for (const variable of prevVariables) {
                            for (const reference of variable.references) {
                                const idRange = reference.identifier.range;

                                if (idRange[0] >= declaration.range[1]) {
                                    if (first) {
                                        prevDeclarations.shift();
                                        // eslint-disable-next-line no-labels
                                        continue decls;
                                    }
                                    return;
                                }
                            }
                        }
                        first = false;
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

                const prev = prevDeclarations.find(
                    (declaration) => typeof order[declaration.kind] === "number"
                );

                if (!prev) {
                    return;
                }

                context.report({
                    node,
                    messageId: "order",
                    data: {
                        thisKind: node.kind,
                        prevKind: prev.kind,
                        prevVar: context.getDeclaredVariables(prev)[0].name,
                    },
                });
            },
        };
    },
};
