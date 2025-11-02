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

// Map emojis to random identifiers
function replaceEmojisWithIdentifiers(code) {
  // Regex to match emoji characters (excluding bug spray 🧴)
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu;

  // Find all unique emojis (except bug spray)
  const emojis = new Set();
  const matches = code.matchAll(emojiRegex);
  for (const match of matches) {
    if (match[0] !== "🧴") {
      // Exclude bug spray
      emojis.add(match[0]);
    }
  }

  // Generate random identifier for each emoji
  const emojiMap = new Map();
  const usedIdentifiers = new Set();

  function generateRandomIdentifier() {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let identifier;
    do {
      // Generate 6-12 character identifier
      const length = 6 + Math.floor(Math.random() * 7);
      identifier = "_emoji_";
      for (let i = 0; i < length; i++) {
        identifier += chars[Math.floor(Math.random() * chars.length)];
      }
    } while (usedIdentifiers.has(identifier));
    usedIdentifiers.add(identifier);
    return identifier;
  }

  // Map each emoji to a unique random identifier
  for (const emoji of emojis) {
    emojiMap.set(emoji, generateRandomIdentifier());
  }

  // Replace all emojis in code (except bug spray)
  let result = code;
  for (const [emoji, identifier] of emojiMap) {
    result = result.replaceAll(emoji, identifier);
  }

  return { code: result, emojiMap };
}

const { code: codeWithEmojiReplacements, emojiMap } =
  replaceEmojisWithIdentifiers(code);
const codeWithoutSpray = codeWithEmojiReplacements.replaceAll("🧴", "");
parser.feed(codeWithoutSpray);

const wrapInDeletedChecker = (key, code) =>
  `if(deletedIdentifiers.has("${key}")){throw new Error("${key} was deleted")}${code}`;

function removeStartEndAndStringify(obj) {
  function removeKeys(item) {
    if (item === null || typeof item !== "object") {
      return item;
    }
    if (Array.isArray(item)) {
      return item.map(removeKeys);
    }
    const result = {};
    for (const key in item) {
      if (key !== "start" && key !== "end") {
        result[key] = removeKeys(item[key]);
      }
    }
    return result;
  }
  return JSON.stringify(removeKeys(obj));
}

function checkIndentationsDivisibleBy3(code) {
  const lines = code.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let leadingSpaces = 0;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === " ") leadingSpaces++;
      else break;
    }
    if (leadingSpaces % 3 !== 0) {
      throw new Error(
        `Line ${
          i + 1
        } has ${leadingSpaces} spaces, which is not a multiple of 3`
      );
    }
  }
}

// checkIndentationsDivisibleBy3(code);

// console.log(JSON.stringify(parser.results[0], null, 2));

let finalCode = `const deletedIdentifiers = new Set();\nconst redefinedNumbers = {}\n`;
let finalNode, finalNode2;
function transpile(node) {
  if (node === undefined) {
    console.error("Undefined node");
    console.log(finalNode);
    console.log(finalNode2);
    return "";
  }
  finalNode2 = finalNode;
  finalNode = node;

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
      // var_name is a token object, use .value directly
      if (!node.var_name || !node.var_name.value) {
        console.error(
          "var_assignment missing var_name:",
          JSON.stringify(node, null, 2)
        );
        return "";
      }
      if (!node.value) {
        console.error(
          "var_assignment missing value:",
          JSON.stringify(node, null, 2)
        );
        return "";
      }
      return wrapInDeletedChecker(
        node.var_name.value,
        `${node.var_name.value}=${transpile(node.value)}`
      );
    case "var_initialization":
      // Handle both identifier and number_literal as variable names
      if (!node.value) {
        console.error(
          "var_initialization missing value:",
          JSON.stringify(node, null, 2)
        );
        return "";
      }
      if (node.var_name && node.var_name.type === "number_literal") {
        const varNameValue = node.var_name.value.toString();
        return wrapInDeletedChecker(
          varNameValue,
          `redefinedNumbers["${varNameValue}"] = ${transpile(node.value)}`
        );
      }
      // Identifier case - var_name is a token object, use .value directly
      if (!node.var_name || !node.var_name.value) {
        console.error(
          "var_initialization missing var_name:",
          JSON.stringify(node, null, 2)
        );
        return "";
      }
      return wrapInDeletedChecker(
        node.var_name.value,
        `var ${node.var_name.value}=${transpile(node.value)}`
      );
    case "boolean_literal":
      if (node.value === "maybe") return Math.random() < 0.5 ? "true" : "false";
      return node.value;
    case "string_literal":
      return `"${node.value}"`;
    case "list_literal":
      return `[${node.items.map(transpile).join(",")}]`;
    case "indexed_access": {
      const subjectExpr = transpile(node.subject);
      const indexExpr = transpile(node.index);
      return `(() => {
        const subject = ${subjectExpr};
        if (Number.isInteger(subject)) {
          // x[i] where i starts from -1, so x[-1] is 1st digit, x[0] is 2nd digit, etc.
          const digits = Math.abs(subject).toString().split('').map(Number);
          const idx = ${indexExpr} + 1; // Convert from -1-based to 0-based indexing
          if (idx >= 0 && idx < digits.length) {
            return digits[idx];
          }
          return undefined;
        }
        return subject[${indexExpr}+1];
      })()`;
    }
    case "indexed_assignment": {
      const subjectExpr = transpile(node.subject);
      const indexExpr = transpile(node.index);
      const valueExpr = transpile(node.value);
      return wrapInDeletedChecker(
        node.subject.value,
        `(() => {
          const subject = ${subjectExpr};
          if (Number.isInteger(subject)) {
            // x[i] = val where i starts from -1, so x[-1] modifies 1st digit, x[0] modifies 2nd digit, etc.
            const isNegative = subject < 0;
            const digits = Math.abs(subject).toString().split('').map(Number);
            const idx = ${indexExpr} + 1; // Convert from -1-based to 0-based indexing
            if (idx >= 0 && idx < digits.length) {
              const newDigit = Math.floor(Math.abs(${valueExpr})) % 10; // Ensure single digit
              digits[idx] = newDigit;
              const newValue = parseInt(digits.join(''));
              return isNegative ? -newValue : newValue;
            }
            return subject;
          }
          subject[${indexExpr}+1] = ${valueExpr};
        })()`
      );
    }
    case "binary_operation":
      if (node.operator.value === "====")
        return (
          removeStartEndAndStringify(node.left) ===
          removeStartEndAndStringify(node.right)
        );
      if (node.operator.value === "!===")
        return (
          removeStartEndAndStringify(node.left) !==
          removeStartEndAndStringify(node.right)
        );
      // Handle single = comparison - checks if rounded numeric values are equal
      if (node.operator.value === "=") {
        const leftExpr = transpile(node.left);
        const rightExpr = transpile(node.right);
        return `(() => {
          let leftVal = Number(${leftExpr});
          let rightVal = Number(${rightExpr});
          if(isNaN(leftVal) || isNaN(rightVal)){return false;}
          return Math.round(leftVal) === Math.round(rightVal);
        })()`;
      }
      // Convert 'and' to '&&' and 'or' to '||'
      let operatorValue = node.operator.value.toString();
      if (operatorValue === "and") {
        operatorValue = "&&";
      } else if (operatorValue === "or") {
        operatorValue = "||";
      }
      const leftExpr = transpile(node.left);
      const rightExpr = transpile(node.right);

      if (operatorValue === "/") {
        const fullExpr = `${leftExpr}${operatorValue}${rightExpr}`;
        return `(() => {${wrapInDeletedChecker(
          operatorValue,
          `let rightOperand = ${rightExpr};
           if(rightOperand === 0){return Math.random() < 0.5 ? 0 : 1;}
           let result = ${fullExpr}; 
           if(deletedIdentifiers.has(result.toString())){throw new Error(\`$\{result\} was deleted\`)};
           if(redefinedNumbers.hasOwnProperty(result.toString())){return redefinedNumbers[result.toString()]};
           return result`
        )}})()`;
      }

      const fullExpr = `${leftExpr}${operatorValue}${rightExpr}`;

      return `(() => {${wrapInDeletedChecker(
        operatorValue,
        `let result = ${fullExpr}; 
         if(deletedIdentifiers.has(result.toString())){throw new Error(\`$\{result\} was deleted\`)};
         if(redefinedNumbers.hasOwnProperty(result.toString())){return redefinedNumbers[result.toString()]};
         return result`
      )}})()`;
    case "number_literal":
      return `(() => {
        if(redefinedNumbers.hasOwnProperty(${node.value.toString()})){return redefinedNumbers[${node.value.toString()}]};
        return ${node.value.toString()}
      })()`;
    case "return_statement":
      return wrapInDeletedChecker("return", `return ${transpile(node.value)}`);
    case "sizeof":
      // sizeof identifier transpiles to identifier.length
      return `(() => {${wrapInDeletedChecker(
        node.identifier.value,
        `return ${node.identifier.value}.length`
      )}})()`;
    case "var_reference":
      return `(() => {${wrapInDeletedChecker(
        node.var_name.value,
        `return ${transpile(node.var_name)}`
      )}})()`;
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
        return wrapInDeletedChecker(
          "print",
          `console.log(${node.arguments.map(transpile)})`
        );
      return `(() => {${wrapInDeletedChecker(
        node.fun_name.value,
        `return ${transpile(node.fun_name)}(${node.arguments.map(transpile)})`
      )}})()`;
    }
    case "while_loop":
      return wrapInDeletedChecker(
        "while",
        `while(${transpile(node.condition)})\n${transpile(node.body)}\n`
      );
    case "delete_statement":
      return wrapInDeletedChecker(
        "delete",
        `deletedIdentifiers.add("${transpile(node.identifier)}");`
      );
    case "if_statement":
      const consequentCode = transpile(node.consequent);
      if (node.alternate) {
        return wrapInDeletedChecker(
          "if",
          `if(${transpile(
            node.condition
          )})\n${consequentCode}\nelse\n{${wrapInDeletedChecker(
            "else",
            transpile(node.alternate)
          )}}`
        );
      } else {
        return wrapInDeletedChecker(
          "if",
          `if(${transpile(node.condition)})\n${consequentCode}`
        );
      }
    default:
      console.error("Undefined node: " + JSON.stringify(node, null, 2));
  }
}
const jsCode = parser.results[0].map(transpile).join("\n");
// console.log(jsCode);
finalCode += jsCode;

const outputFileName = "output.js";
fs.writeFileSync(outputFileName, finalCode, "utf-8");

exec(`node ${outputFileName}`, (error, stdout, stderr) => {
  console.log(stdout);
  if (error) {
    console.error(`Execution error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Runtime error:\n${stderr}`);
    return;
  }
});

// setTimeout(() => {
//   fs.unlinkSync(fileName);
// }, 100);
