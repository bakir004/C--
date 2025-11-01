@{%
const moo = require("moo");

const lexer = moo.compile({
    ws: /[ \t]+/,
    nl: { match: "\n", lineBreaks: true },
    // Order matters: "<=",
    lt: "<",
    gte: ">=",
    gt: ">",
    eq: "==",
    streq: "===",
    exstreq: "====",
    neq: "!=",
    strneq: "!==",
    exstrneq: "!===",
    lparan: "(",
    rparan: ")",
    comma: ",",
    lbracket: "[",
    rbracket: "]",
    lbrace: "{",
    rbrace: "}",
    assignment: "=",
    plus: "+",
    minus: "-",
    multiply: "*",
    divide: "/",
    modulo: "%",
    colon: ":",
    comment: {
        match: /#[^\n]*/,
        value: s => s.substring(1)
    },
    string_literal: {
        // Match string starting with any mix of " or ', followed by content, ending with any mix of " or '
        // Allows mixed quotes like "word' or 'word"
        match: /["']+(?:[^"'\n\\]|\\.)*?["']+/,
        value: s => s
    },
    number_literal: {
        match: /[0-9]+(?:\.[0-9]+)?/,
        value: s => Number(s)
    },
    identifier: {
        match: /[a-z_][a-z_0-9]*/,
        type: moo.keywords({
            while: "while",
            fn: "fn",
            for: "for",
            else: "else",
            in: "in",
            if: "if",
            return: "return",
            and: "and",
            or: "or",
            true: "true",
            false: "false",
            maybe: "maybe",
            delete: "delete"
        })
    }
});


function tokenStart(token) {
    return {
        line: token.line,
        col: token.col - 1
    };
}

function tokenEnd(token) {
    const lastNewLine = token.text.lastIndexOf("\n");
    if (lastNewLine !== -1) {
        throw new Error("Unsupported case: token with line breaks");
    }
    return {
        line: token.line,
        col: token.col + token.text.length - 1
    };
}

function convertToken(token) {
    return {
        type: token.type,
        value: token.value,
        start: tokenStart(token),
        end: tokenEnd(token)
    };
}

function convertTokenId(data) {
    return convertToken(data[0]);
}


%}

@lexer lexer

input -> top_level_statements {% id %}

top_level_statements
    ->  top_level_statement
        {%
            d => [d[0]]
        %}
    |  top_level_statement _ "\n" _ top_level_statements
        {%
            d => [
                d[0],
                ...d[4]
            ]
        %}
    # below 2 sub-rules handle blank lines
    |  _ "\n" top_level_statements
        {%
            d => d[2]
        %}
    |  _
        {%
            d => []
        %}

top_level_statement
    -> fun_definition        {% id %}
    |  executable_statement {% id %}


fun_definition
    -> "fn" _ identifier _ "(" _ parameter_list _ ")" _ code_block
        {%
            d => ({
                type: "fun_definition",
                name: d[2],
                parameters: d[6],
                body: d[10],
                start: tokenStart(d[0]),
                end: d[10].end
            })
        %}

parameter_list
    -> null        {% () => [] %}
    | identifier   {% d => [d[0]] %}
    | identifier _ "," _ parameter_list
        {%
            d => [d[0], ...d[4]]
        %}

code_block -> "{" executable_statements "}"
    {%
        (d) => ({
            type: "code_block",
            statements: d[1],
            start: tokenStart(d[0]),
            end: tokenEnd(d[2])
        })
    %}

executable_statements
    -> _
        {% () => [] %}
    |  _ "\n" executable_statements
        {% (d) => d[2] %}
    |  _ executable_statement _
        {% d => [d[1]] %}
    |  _ executable_statement _ "\n" executable_statements
        {%
            d => [d[1], ...d[4]]
        %}

executable_statement
   -> return_statement     {% id %}
   |  var_assignment       {% id %}
   |  var_initialization   {% id %}
   |  call_statement       {% id %}
   |  line_comment         {% id %}
   |  indexed_assignment   {% id %}
   |  while_loop           {% id %}
   |  if_statement         {% id %}
   |  print_statement      {% id %}
   |  delete_statement     {% id %}

print_statement
    -> "print" __ "(" _ expression _ ")"

delete_statement
   -> "delete" __ deletable 
        {%
            d => ({
                type: "delete_statement",
                identifier: d[2],
                start: tokenStart(d[0]),
                end: d[2].end
            })
        %}

return_statement
   -> "return" __ expression
       {%
           d => ({
               type: "return_statement",
               value: d[2],
               start: tokenStart(d[0]),
               end: d[2].end
           })
       %}

var_initialization
    -> "naprimjer" _ identifier _ "=" _ expression
        {%
            d => ({
                type: "var_initialization",
                var_name: d[2],
                value: d[6],
                start: d[0].start,
                end: d[6].end
            })
        %}
    |  "naprimjer" _ number _ "=" _ expression
        {%
            d => ({
                type: "var_initialization",
                var_name: d[2],
                value: d[6],
                start: d[0].start,
                end: d[6].end
            })
        %}

var_assignment
    -> identifier _ "=" _ expression
        {%
            d => ({
                type: "var_assignment",
                var_name: d[0],
                value: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

call_statement -> call_expression  {% id %}

call_expression
    -> identifier _ "(" argument_list ")"
        {%
            d => ({
                type: "call_expression",
                fun_name: d[0],
                arguments: d[3],
                start: d[0].start,
                end: tokenEnd(d[4])
            })
        %}

indexed_access
    -> unary_expression _ "[" _ expression _ "]"
        {%
            d => ({
                type: "indexed_access",
                subject: d[0],
                index: d[4],
                start: d[0].start,
                end: tokenEnd(d[6])
            })
        %}

indexed_assignment
    -> unary_expression _ "[" _ expression _ "]" _ "=" _ expression
        {%
            d => ({
                type: "indexed_assignment",
                subject: d[0],
                index: d[4],
                value: d[10],
                start: d[0].start,
                end: d[10].end
            })
        %}

while_loop
    -> "while" __ expression __ code_block
        {%
            d => ({
                type: "while_loop",
                condition: d[2],
                body: d[4],
                start: tokenStart(d[0]),
                end: d[4].end
            })
        %}

if_statement
    -> "if" __ expression __ code_block
        {%
            d => ({
                type: "if_statement",
                condition: d[2],
                consequent: d[4],
                start: tokenStart(d[0]),
                end: d[4].end
            })
        %}
    |  "if" __ expression _ code_block _
       "else" __ code_block
        {%
            d => ({
                type: "if_statement",
                condition: d[2],
                consequent: d[4],
                alternate: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
        %}
    |  "if" __ expression _ code_block _
       "else" __ if_statement
       {%
            d => ({
                type: "if_statement",
                condition: d[2],
                consequent: d[4],
                alternate: d[8],
                start: tokenStart(d[0]),
                end: d[8].end
            })
       %}

argument_list
    -> null {% () => [] %}
    |  _ expression _  {% d => [d[1]] %}
    |  _ expression _ "," argument_list
        {%
            d => [d[1], ...d[4]]
        %}

expression -> boolean_expression         {% id %}

boolean_expression
    -> comparison_expression     {% id %}
    |  comparison_expression _ boolean_operator _ boolean_expression
        {%
            d => ({
                type: "binary_operation",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

boolean_operator
    -> "and"      {% id %}
    |  "or"       {% id %}

comparison_expression
    -> additive_expression    {% id %}
    |  additive_expression _ comparison_operator _ comparison_expression
        {%
            d => ({
                type: "binary_operation",
                operator: d[2],
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

comparison_operator
    -> ">"    {% convertTokenId %}
    |  ">="   {% convertTokenId %}
    |  "<"    {% convertTokenId %}
    |  "<="   {% convertTokenId %}
    |  "=="   {% convertTokenId %}
    |  "==="  {% convertTokenId %}
    |  "====" {% convertTokenId %}
    |  "!="   {% convertTokenId %}
    |  "!=="  {% convertTokenId %}
    |  "!===" {% convertTokenId %}

additive_expression
    -> multiplicative_expression    {% id %}
    |  multiplicative_expression _ [+-] _ additive_expression
        {%
            d => ({
                type: "binary_operation",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

multiplicative_expression
    -> unary_expression     {% id %}
    |  unary_expression _ [*/%] _ multiplicative_expression
        {%
            d => ({
                type: "binary_operation",
                operator: convertToken(d[2]),
                left: d[0],
                right: d[4],
                start: d[0].start,
                end: d[4].end
            })
        %}

unary_expression
    -> number               {% id %}
    | "-" number            {% d => {d[1].value = -d[1].value; return d[1]} %}
    |  identifier
        {%
            d => ({
                type: "var_reference",
                var_name: d[0],
                start: d[0].start,
                end: d[0].end
            })
        %}
    |  call_expression      {% id %}
    |  string_literal       {% id %}
    |  list_literal         {% id %}
    |  boolean_literal      {% id %}
    |  indexed_access       {% id %}
    |  "(" expression ")"
        {%
            data => data[1]
        %}

list_literal
    -> "[" list_items "]"
        {%
            d => ({
                type: "list_literal",
                items: d[1],
                start: tokenStart(d[0]),
                end: tokenEnd(d[2])
            })
        %}

list_items
    -> null
        {% () => [] %}
    |  _ml expression _ml
        {% d => [d[1]] %}
    |  _ml expression _ml "," list_items
        {%
            d => [
                d[1],
                ...d[4]
            ]
        %}

boolean_literal
    -> "true"
        {%
            d => ({
                type: "boolean_literal",
                value: true,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}
    |  "false"
        {%
            d => ({
                type: "boolean_literal",
                value: false,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}
    | "maybe"
        {%
            d => ({
                type: "boolean_literal",
                value: Math.random() < 0.5,
                start: tokenStart(d[0]),
                end: tokenEnd(d[0])
            })
        %}


line_comment -> %comment {% convertTokenId %}

string_literal 
    -> %string_literal
        {%
            d => {
                const token = convertToken(d[0]);
                const s = token.value;
                // Count actual quote characters on each side (for slicing)
                let openQuoteCharCount = 0;
                let i = 0;
                while (i < s.length && (s[i] === '"' || s[i] === "'")) {
                    openQuoteCharCount++;
                    i++;
                }
                
                let closeQuoteCharCount = 0;
                let j = s.length - 1;
                while (j >= 0 && (s[j] === '"' || s[j] === "'")) {
                    closeQuoteCharCount++;
                    j--;
                }
                
                // Calculate weighted counts for validation (double quotes count as 2, single as 1)
                let openQuoteCount = 0;
                for (let k = 0; k < openQuoteCharCount; k++) {
                    if(s[k] === '"')
                        openQuoteCount += 2;
                    else if(s[k] === "'")
                        openQuoteCount += 1;
                }
                
                let closeQuoteCount = 0;
                for (let k = s.length - closeQuoteCharCount; k < s.length; k++) {
                    if(s[k] === '"')
                        closeQuoteCount += 2;
                    else if(s[k] === "'")
                        closeQuoteCount += 1;
                }
                
                // Validate that total quote count matches on both sides
                if (openQuoteCount === 0 || closeQuoteCount === 0 || openQuoteCount !== closeQuoteCount) {
                    throw new Error(`String literal quotes don't match: ${openQuoteCount} opening quotes but ${closeQuoteCount} closing quotes`);
                }
                
                // Remove quotes and parse escape sequences
                const content = closeQuoteCharCount > 0 
                    ? s.slice(openQuoteCharCount, -closeQuoteCharCount)
                    : s.slice(openQuoteCharCount);
                const parsed = content.replace(/\\(?:["'\\ntbfr]|u([0-9a-fA-F]{4}))/g, (match, hex) => {
                    if (hex) return String.fromCharCode(parseInt(hex, 16));
                    const escapeMap = {
                        '\\"': '"',
                        "\\'": "'",
                        '\\\\': '\\',
                        '\\n': '\n',
                        '\\t': '\t',
                        '\\b': '\b',
                        '\\f': '\f',
                        '\\r': '\r'
                    };
                    return escapeMap[match] || match;
                });
                return {
                    type: token.type,
                    value: parsed,
                    start: token.start,
                    end: token.end
                };
            }
        %}

number -> %number_literal {% convertTokenId %}

identifier -> %identifier {% convertTokenId %}

identifier_or_keyword
    -> %identifier  {% convertTokenId %}
    |  "fn"        {% convertTokenId %}
    |  "while"     {% convertTokenId %}
    |  "for"       {% convertTokenId %}
    |  "else"      {% convertTokenId %}
    |  "if"        {% convertTokenId %}
    |  "return"    {% convertTokenId %}
    |  "and"       {% convertTokenId %}
    |  "or"        {% convertTokenId %}
    |  "true"      {% convertTokenId %}
    |  "false"     {% convertTokenId %}
    |  "maybe"     {% convertTokenId %}
    |  "delete"    {% convertTokenId %}

deletable
    -> number                {% id %}
    |  "-" number            {% d => {d[1].value = -d[1].value; return d[1]} %}
    |  identifier_or_keyword  {% id %}
    |  %plus                 {% convertTokenId %}
    |  %minus                {% convertTokenId %}
    |  %multiply             {% convertTokenId %}
    |  %divide               {% convertTokenId %}
    |  %modulo               {% convertTokenId %}
    |  %gt                   {% convertTokenId %}
    |  %gte                  {% convertTokenId %}
    |  %lt                   {% convertTokenId %}
    |  %lte                  {% convertTokenId %}
    |  %eq                   {% convertTokenId %}
    |  %neq                  {% convertTokenId %}
    |  %streq                {% convertTokenId %}
    |  %strneq               {% convertTokenId %}
    |  %exstreq              {% convertTokenId %}
    |  %exstrneq             {% convertTokenId %}
    |  %assignment           {% convertTokenId %}

_ml -> multi_line_ws_char:*

multi_line_ws_char
    -> %ws
    |  "\n"

__ -> %ws:+

_ -> %ws:*
