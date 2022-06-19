# cupcake/case-block
> Enforces block statements in case blocks
> - ⭐️ This rule is included in `plugin:cupcake/recommended` preset.
> - ✒️ The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Enforces block statements in case blocks.

## Rule Details

This rule is a stricter version of
[`no-case-declarations`](https://eslint.org/docs/rules/no-case-declarations),
to always use blocks in case statements

Examples of **incorrect** code:

```js
/*eslint cupcake/case-block: error */

switch (foo) {
    case 1:
        break;
}
```

Examples of **correct** code:

```js
/*eslint cupcake/case-block: error */

switch (foo) {
    case 1: {
        break;
    }
}
```

## Options

Nothing.

## Implementation

- [Rule source](../../lib/rules/case-block.js)
- [Test source](../../tests/lib/rules/case-block.js)
