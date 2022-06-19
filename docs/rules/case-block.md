# cupcake/case-block
> An example rule.
> - ⭐️ This rule is included in `plugin:cupcake/recommended` preset.

This is an example.

## Rule Details

This rule aimed at disallowing `example` identifiers.

Examples of **incorrect** code:

```js
/*eslint cupcake/case-block: error */

var example = 1;
```

Examples of **correct** code:

```js
/*eslint cupcake/case-block: error */

var foo = 1;
```

## Options

Nothing.

## Implementation

- [Rule source](../../lib/rules/case-block.js)
- [Test source](../../tests/lib/rules/case-block.js)
