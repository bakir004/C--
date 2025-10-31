const fs = require("fs");
const nearley = require("nearley");
const grammar = require("./parser.js");
const { exec } = require("child_process");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
// take file input from command line
const fileName = process.argv[2];
if (!fileName) {
  console.log("Usage: node transpile.js <file name>");
  process.exit(1);
}
const code = fs.readFileSync(fileName, "utf-8");

let count = 0;
count += code.split("🧴").length - 1;
const lineCount = code.split("\n").filter((line) => line.trim() !== "").length;
if (count < lineCount / 4) throw new Error("Not enough bug spray!");

const codeWithoutSpray = code.replaceAll("🧴", "");
parser.feed(codeWithoutSpray);

const wrapInDeletedChecker = (key, code) =>
  `if(deletedIdentifiers.has("${key}")){throw new Error("${key} was deleted")}${code}`;

console.log(JSON.stringify(parser.results[0], null, 2));

let finalCode = `const deletedIdentifiers = new Set();\n`;

function transpile(node) {
  switch (node.type) {
    case "fun_definition":
      return (
        wrapInDeletedChecker("fn", "") +
        wrapInDeletedChecker(
          node.name.value,
          `function ${node.name.value}(${node.parameters
            .map(transpile)
            .join(",")})\n${transpile(node.body)}`
        )
      );
    case "identifier":
      return node.value;
    case "comment":
      return "";
    case "code_block":
      return `{${node.statements.map(transpile).join("\n")}}`;
    case "var_assignment":
      return wrapInDeletedChecker(
        node.var_name.value,
        `${transpile(node.var_name)}=${transpile(node.value)}`
      );
    case "var_initialization":
      return wrapInDeletedChecker(
        node.var_name.value,
        `var ${transpile(node.var_name)}=${transpile(node.value)}`
      );
    case "boolean_literal":
      return node.value;
    case "string_literal":
      return `"${node.value}"`;
    case "list_literal":
      return `[${node.items.map(transpile).join(",")}]`;
    case "indexed_access":
      return `${transpile(node.subject)}[${transpile(node.index)}]`;
    case "indexed_assignment":
      return wrapInDeletedChecker(
        node.subject.value,
        `${transpile(node.subject)}[${transpile(node.index)}]=${transpile(
          node.value
        )}`
      );
    case "binary_operation":
      const operatorValue = node.operator.value.toString();
      const leftExpr = transpile(node.left);
      const rightExpr = transpile(node.right);
      const fullExpr = `${leftExpr}${operatorValue}${rightExpr}`;

      return `(() => {${wrapInDeletedChecker(
        operatorValue,
        `return ${fullExpr}`
      )}})()`;
    case "number_literal":
      return node.value;
    case "return_statement":
      return wrapInDeletedChecker("return", `return ${transpile(node.value)}`);
    case "var_reference":
      return transpile(node.var_name);
    case "unary_minus":
      return `(() => {${wrapInDeletedChecker(
        "-",
        `return -${transpile(node.value)}`
      )}})()`;
    case "call_expression": {
      if (
        node.fun_name.type === "identifier" &&
        node.fun_name.value === "print"
      )
        return `console.log(${node.arguments.map(transpile)})`;
      return `${transpile(node.fun_name)}(${node.arguments.map(transpile)})`;
    }
    case "while_loop":
      return wrapInDeletedChecker(
        "while",
        `while(${transpile(node.condition)})\n${transpile(node.body)}\n`
      );
    case "delete_statement":
      return `deletedIdentifiers.add("${node.identifier.value}");`;
  }
}
const jsCode = parser.results[0].map(transpile).join("\n");
console.log(jsCode);
finalCode += jsCode;

const outputFileName = "output.js";
fs.writeFileSync(outputFileName, finalCode, "utf-8");

exec(`node ${outputFileName}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Runtime error:\n${stderr}`);
    return;
  }

  console.log(stdout);
});

// setTimeout(() => {
//   fs.unlinkSync(fileName);
// }, 100);
