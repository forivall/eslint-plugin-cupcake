# cupcake/func-style
> Enforce the consistent use of either function declarations or expressions
> - ⭐️ This rule is included in `plugin:cupcake/recommended` preset.

This rule is based on [eslint's `func-style` rule](https://eslint.org/docs/latest/rules/func-style). Visit their documentation for more in-depth information.

## Rule Details

This rule enforces a particular type of `function` style throughout a JavaScript file, either declarations or expressions. You can specify which you prefer in the configuration.

## Options

This rule has a string option:

* `"expression"` (default) requires the use of function expressions instead of function declarations
* `"declaration"` requires the use of function declarations instead of function expressions

This rule has an object option for exceptions:

* `"allowArrowFunctions"`: `true` (default `false`) allows the use of arrow functions. This option applies only when the string option is set to `"declaration"` (arrow functions are always allowed when the string option is set to `"expression"`, regardless of this option)
* `"allowInnerExpressions"`: `true` (default `allowArrowFunctions`)  allows the use of function expressions in cases which would violate [`no-inner-declarations`](https://eslint.org/docs/rules/no-inner-declarations). This option applies only when the string option is set to `"declaration"`.

### expression

Examples of **incorrect** code for this rule with the default `"expression"` option:

```js
/*eslint func-style: ["error", "expression"]*/

function foo() {
    // ...
}
```

Examples of **correct** code for this rule with the default `"expression"` option:

```js
/*eslint func-style: ["error", "expression"]*/

var foo = function() {
    // ...
};

var foo = () => {};

// allowed as allowArrowFunctions : false is applied only for declaration
```

### declaration

Examples of **incorrect** code for this rule with the `"declaration"` option:

```js
/*eslint func-style: ["error", "declaration"]*/

var foo = function() {
    // ...
};

var foo = () => {};
```

Examples of **correct** code for this rule with the `"declaration"` option:

```js
/*eslint func-style: ["error", "declaration"]*/

function foo() {
    // ...
}

// Methods (functions assigned to objects) are not checked by this rule
SomeObject.foo = function() {
    // ...
};
```

### allowArrowFunctions

Examples of additional **correct** code for this rule with the `"declaration", { "allowArrowFunctions": true }` options:

```js
/*eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }]*/

var foo = () => {};
```

### allowInnerExpressions

Examples of additional **correct** code for this rule with the `"declaration", { "allowArrowFunctions": true }` options:

```js
/*eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }]*/

if (bar) {
    var foo = function () {};
}
```

## When Not To Use It

If you want to allow developers to each decide how they want to write functions on their own, then you can disable this rule.
