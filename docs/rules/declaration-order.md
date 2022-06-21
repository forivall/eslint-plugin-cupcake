# cupcake/declaration-order
> Enforces order of variable declarations
> - ⭐️ This rule is included in `plugin:cupcake/recommended` preset.

Enforces variable declarations to be in a specific order.

## Rule Details

This rule is enforces a preferred order of variable declarations. The default
is `const` before `let`, and ignoring `var`.

Examples of **incorrect** code:

```js
let bar;
const foo = 1;
```

Examples of **correct** code:

```js
const foo = 1;
let bar;
```

If a variable is used in a const declaration, then order will not be enforced.
```js
let foo = 1;
const fooInitial = foo;
```

## Options

The order of declarations can be specified: `["let", "const"]` will enforce
`let` before `const`.

## Implementation

- [Rule source](../../lib/rules/declaration-order.js)
- [Test source](../../tests/lib/rules/declaration-order.js)
