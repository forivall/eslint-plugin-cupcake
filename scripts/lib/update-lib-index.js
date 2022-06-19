"use strict";

const fs = require("fs");
const path = require("path");
const { CLIEngine } = require("eslint");
const { rules } = require("./rules");

const filePath = path.resolve(__dirname, "../../lib/index.js");
const rawContent = `/* DON'T EDIT THIS FILE. This is generated by 'scripts/lib/update-lib-index.js' */
"use strict"

module.exports = {
    configs: {
        recommended: require("./configs/recommended")
    },
    rules: {
        ${rules
            .map((rule) => `"${rule.name}": require("./rules/${rule.name}")`)
            .join(",\n        ")}
    }
};
`;
const engine = new CLIEngine({ fix: true });
const lintResult = engine.executeOnText(rawContent, filePath);
const content = lintResult.results[0].output || rawContent;

fs.writeFileSync(filePath, content);
