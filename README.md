# eslint-plugin-cupcake

[![npm version](https://img.shields.io/npm/v/eslint-plugin-cupcake.svg)](https://www.npmjs.com/package/eslint-plugin-cupcake)
[![build status](https://github.com/forivall/eslint-plugin-cupcake/actions/workflows/main.yml/badge.svg)](https://github.com/forivall/eslint-plugin-cupcake/actions/workflows/main.yml)
<!--
[![coverage status](https://coveralls.io/repos/github/forivall/eslint-plugin-cupcake/badge.svg)](https://coveralls.io/github/forivall/eslint-plugin-cupcake)
-->

A collection of eslint rules for consistent code standards.

## Installation

Use [npm](https://www.npmjs.com/) or a compatible tool to install.

```
$ npm install --save-dev eslint eslint-plugin-cupcake
```

### Requirements

- Node.js v14.15.0 or newer versions.
- ESLint v6.8.0 or newer versions.

## Usage

Write your config file such as `.eslintrc.yml`.

```yml
plugins:
  - cupcake
rules:
  cupcake/case-block: error
```

See also [Configuring ESLint](https://eslint.org/docs/user-guide/configuring).

## Configs

- `cupcake/recommended` ... enables the recommended rules.

## Rules

<!--RULE_TABLE_BEGIN-->
### Stylistic Issues

| Rule ID | Description |    |
|:--------|:------------|:--:|
| [cupcake/case-block](./docs/rules/case-block.md) | Enforces block statements in case blocks | ⭐️✒️ |
| [cupcake/declaration-order](./docs/rules/declaration-order.md) | Enforces order of variable declarations | ⭐️ |
| [cupcake/func-style](./docs/rules/func-style.md) | Enforce the consistent use of either `function` declarations or expressions | ⭐️ |

<!--RULE_TABLE_END-->

## Semantic Versioning Policy

This plugin follows [Semantic Versioning](http://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

## Changelog

- [GitHub Releases](https://github.com/forivall/eslint-plugin-cupcake/releases)

## Contributing

Welcome your contribution!

See also [ESLint Contribution Guide](https://eslint.org/docs/developer-guide/contributing/).

### Development Tools

- `npm test` runs tests and measures coverage.
- `npm version <TYPE>` updates the package version. And it updates `lib/configs/recommended.js`, `lib/index.js`, and `README.md`'s rule table. See also [npm version CLI command](https://docs.npmjs.com/cli/version).
- `npm run add-rule <RULE_ID>` creates three files to add a new rule.
