const fs = require("fs");
const nearley = require("nearley");
const grammar = require("./parser.js");
const { exec } = require("child_process");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
const code = fs.readFileSync("example.cmm", "utf-8");

let count = 0;
count += code.split("🧴").length - 1;
const lineCount = code.split("\n").filter((line) => line.trim() !== "").length;
if (count < lineCount / 4) throw new Error("Not enough bug spray!");

const codeWithoutSpray = code.replaceAll("🧴", "");
parser.feed(codeWithoutSpray);

// console.log(JSON.stringify(parser.results[0], null, 2));

let finalCode = "const deletedIdentifiers = new Set();\n";

function transpile(node) {
  switch (node.type) {
    case "fun_definition":
      return (
        "function " +
        node.name.value +
        "(" +
        node.parameters.map(transpile).join(",") +
        ")\n" +
        transpile(node.body)
      );
    case "identifier":
      return node.value;
    case "code_block":
      return "{" + node.statements.map(transpile).join("\n") + "}";
    case "var_assignment":
      return "let " + transpile(node.var_name) + "=" + transpile(node.value);
    case "binary_operation":
      return (
        transpile(node.left) +
        node.operator.value.toString() +
        transpile(node.right)
      );
    case "multiply":
      return node.value;
    case "number_literal":
      return node.value;
    case "return_statement":
      return "return " + transpile(node.value);
    case "var_reference":
      return transpile(node.var_name);
    case "unary_minus":
      return "-" + transpile(node.value);
    case "call_expression": {
      if (
        node.fun_name.type === "identifier" &&
        node.fun_name.value === "print"
      )
        return "console.log(" + node.arguments.map(transpile) + ")";
      return (
        transpile(node.fun_name) + "(" + node.arguments.map(transpile) + ")"
      );
    }
    case "while_loop":
      return (
        'if(!deletedIdentifiers.has("while")){' +
        "while(" +
        transpile(node.condition) +
        ")" +
        "\n" +
        transpile(node.body) +
        "\n" +
        "} else {" +
        `throw new Error("while loop was deleted but used on line ${node.start.line}");` +
        "}"
      );
    case "delete_statement":
      return 'deletedIdentifiers.add("' + node.identifier.value + '");';
    case "string_literal":
      return '"' + node.value + '"';
  }
}
const jsCode = parser.results[0].map(transpile).join("\n");
// console.log(jsCode);
finalCode += jsCode;

const fileName = "output.js";
fs.writeFileSync(fileName, finalCode, "utf-8");

exec(`node ${fileName}`, (error, stdout, stderr) => {
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

setTimeout(() => {
  fs.unlinkSync(fileName);
}, 100);
