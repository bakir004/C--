// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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


var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "input", "symbols": ["top_level_statements"], "postprocess": id},
    {"name": "top_level_statements", "symbols": ["top_level_statement"], "postprocess": 
        d => [d[0]]
                },
    {"name": "top_level_statements", "symbols": ["top_level_statement", "_", {"literal":"\n"}, "_", "top_level_statements"], "postprocess": 
        d => [
            d[0],
            ...d[4]
        ]
                },
    {"name": "top_level_statements", "symbols": ["_", {"literal":"\n"}, "top_level_statements"], "postprocess": 
        d => d[2]
                },
    {"name": "top_level_statements", "symbols": ["_"], "postprocess": 
        d => []
                },
    {"name": "top_level_statement", "symbols": ["fun_definition"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["executable_statement"], "postprocess": id},
    {"name": "fun_definition", "symbols": [{"literal":"fn"}, "_", "identifier", "_", {"literal":"("}, "_", "parameter_list", "_", {"literal":")"}, "_", "code_block"], "postprocess": 
        d => ({
            type: "fun_definition",
            name: d[2],
            parameters: d[6],
            body: d[10],
            start: tokenStart(d[0]),
            end: d[10].end
        })
                },
    {"name": "parameter_list", "symbols": [], "postprocess": () => []},
    {"name": "parameter_list", "symbols": ["identifier"], "postprocess": d => [d[0]]},
    {"name": "parameter_list", "symbols": ["identifier", "_", {"literal":","}, "_", "parameter_list"], "postprocess": 
        d => [d[0], ...d[4]]
                },
    {"name": "code_block", "symbols": [{"literal":"{"}, "executable_statements", {"literal":"}"}], "postprocess": 
        (d) => ({
            type: "code_block",
            statements: d[1],
            start: tokenStart(d[0]),
            end: tokenEnd(d[2])
        })
            },
    {"name": "executable_statements", "symbols": ["_"], "postprocess": () => []},
    {"name": "executable_statements", "symbols": ["_", {"literal":"\n"}, "executable_statements"], "postprocess": (d) => d[2]},
    {"name": "executable_statements", "symbols": ["_", "executable_statement", "_"], "postprocess": d => [d[1]]},
    {"name": "executable_statements", "symbols": ["_", "executable_statement", "_", {"literal":"\n"}, "executable_statements"], "postprocess": 
        d => [d[1], ...d[4]]
                },
    {"name": "executable_statement", "symbols": ["return_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["var_assignment"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["var_initialization"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["call_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["line_comment"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["indexed_assignment"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["while_loop"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["if_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["print_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["delete_statement"], "postprocess": id},
    {"name": "print_statement", "symbols": [{"literal":"print"}, "__", {"literal":"("}, "_", "expression", "_", {"literal":")"}]},
    {"name": "delete_statement", "symbols": [{"literal":"delete"}, "__", "deletable"], "postprocess": 
        d => ({
            type: "delete_statement",
            identifier: d[2],
            start: tokenStart(d[0]),
            end: d[2].end
        })
                },
    {"name": "return_statement", "symbols": [{"literal":"return"}, "__", "expression"], "postprocess": 
        d => ({
            type: "return_statement",
            value: d[2],
            start: tokenStart(d[0]),
            end: d[2].end
        })
               },
    {"name": "var_initialization", "symbols": [{"literal":"naprimjer"}, "_", "identifier", "_", {"literal":"="}, "_", "expression"], "postprocess": 
        d => ({
            type: "var_initialization",
            var_name: d[2],
            value: d[6],
            start: d[0].start,
            end: d[6].end
        })
                },
    {"name": "var_initialization", "symbols": [{"literal":"naprimjer"}, "_", "number", "_", {"literal":"="}, "_", "expression"], "postprocess": 
        d => ({
            type: "var_initialization",
            var_name: d[2],
            value: d[6],
            start: d[0].start,
            end: d[6].end
        })
                },
    {"name": "var_assignment", "symbols": ["identifier", "_", {"literal":"="}, "_", "expression"], "postprocess": 
        d => ({
            type: "var_assignment",
            var_name: d[0],
            value: d[4],
            start: d[0].start,
            end: d[4].end
        })
                },
    {"name": "call_statement", "symbols": ["call_expression"], "postprocess": id},
    {"name": "call_expression", "symbols": ["identifier", "_", {"literal":"("}, "argument_list", {"literal":")"}], "postprocess": 
        d => ({
            type: "call_expression",
            fun_name: d[0],
            arguments: d[3],
            start: d[0].start,
            end: tokenEnd(d[4])
        })
                },
    {"name": "indexed_access", "symbols": ["unary_expression", "_", {"literal":"["}, "_", "expression", "_", {"literal":"]"}], "postprocess": 
        d => ({
            type: "indexed_access",
            subject: d[0],
            index: d[4],
            start: d[0].start,
            end: tokenEnd(d[6])
        })
                },
    {"name": "indexed_assignment", "symbols": ["unary_expression", "_", {"literal":"["}, "_", "expression", "_", {"literal":"]"}, "_", {"literal":"="}, "_", "expression"], "postprocess": 
        d => ({
            type: "indexed_assignment",
            subject: d[0],
            index: d[4],
            value: d[10],
            start: d[0].start,
            end: d[10].end
        })
                },
    {"name": "while_loop", "symbols": [{"literal":"while"}, "__", "expression", "__", "code_block"], "postprocess": 
        d => ({
            type: "while_loop",
            condition: d[2],
            body: d[4],
            start: tokenStart(d[0]),
            end: d[4].end
        })
                },
    {"name": "if_statement", "symbols": [{"literal":"if"}, "__", "expression", "__", "code_block"], "postprocess": 
        d => ({
            type: "if_statement",
            condition: d[2],
            consequent: d[4],
            start: tokenStart(d[0]),
            end: d[4].end
        })
                },
    {"name": "if_statement", "symbols": [{"literal":"if"}, "__", "expression", "_", "code_block", "_", {"literal":"else"}, "__", "code_block"], "postprocess": 
        d => ({
            type: "if_statement",
            condition: d[2],
            consequent: d[4],
            alternate: d[8],
            start: tokenStart(d[0]),
            end: d[8].end
        })
                },
    {"name": "if_statement", "symbols": [{"literal":"if"}, "__", "expression", "_", "code_block", "_", {"literal":"else"}, "__", "if_statement"], "postprocess": 
        d => ({
            type: "if_statement",
            condition: d[2],
            consequent: d[4],
            alternate: d[8],
            start: tokenStart(d[0]),
            end: d[8].end
        })
               },
    {"name": "argument_list", "symbols": [], "postprocess": () => []},
    {"name": "argument_list", "symbols": ["_", "expression", "_"], "postprocess": d => [d[1]]},
    {"name": "argument_list", "symbols": ["_", "expression", "_", {"literal":","}, "argument_list"], "postprocess": 
        d => [d[1], ...d[4]]
                },
    {"name": "expression", "symbols": ["boolean_expression"], "postprocess": id},
    {"name": "boolean_expression", "symbols": ["comparison_expression"], "postprocess": id},
    {"name": "boolean_expression", "symbols": ["comparison_expression", "_", "boolean_operator", "_", "boolean_expression"], "postprocess": 
        d => ({
            type: "binary_operation",
            operator: convertToken(d[2]),
            left: d[0],
            right: d[4],
            start: d[0].start,
            end: d[4].end
        })
                },
    {"name": "boolean_operator", "symbols": [{"literal":"and"}], "postprocess": id},
    {"name": "boolean_operator", "symbols": [{"literal":"or"}], "postprocess": id},
    {"name": "comparison_expression", "symbols": ["additive_expression"], "postprocess": id},
    {"name": "comparison_expression", "symbols": ["additive_expression", "_", "comparison_operator", "_", "comparison_expression"], "postprocess": 
        d => ({
            type: "binary_operation",
            operator: d[2],
            left: d[0],
            right: d[4],
            start: d[0].start,
            end: d[4].end
        })
                },
    {"name": "comparison_operator", "symbols": [{"literal":">"}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":">="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"<"}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"<="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"=="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"==="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"===="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"!="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"!=="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"!==="}], "postprocess": convertTokenId},
    {"name": "additive_expression", "symbols": ["multiplicative_expression"], "postprocess": id},
    {"name": "additive_expression", "symbols": ["multiplicative_expression", "_", /[+-]/, "_", "additive_expression"], "postprocess": 
        d => ({
            type: "binary_operation",
            operator: convertToken(d[2]),
            left: d[0],
            right: d[4],
            start: d[0].start,
            end: d[4].end
        })
                },
    {"name": "multiplicative_expression", "symbols": ["unary_expression"], "postprocess": id},
    {"name": "multiplicative_expression", "symbols": ["unary_expression", "_", /[*/%]/, "_", "multiplicative_expression"], "postprocess": 
        d => ({
            type: "binary_operation",
            operator: convertToken(d[2]),
            left: d[0],
            right: d[4],
            start: d[0].start,
            end: d[4].end
        })
                },
    {"name": "unary_expression", "symbols": ["number"], "postprocess": id},
    {"name": "unary_expression", "symbols": [{"literal":"-"}, "number"], "postprocess": d => {d[1].value = -d[1].value; return d[1]}},
    {"name": "unary_expression", "symbols": ["identifier"], "postprocess": 
        d => ({
            type: "var_reference",
            var_name: d[0],
            start: d[0].start,
            end: d[0].end
        })
                },
    {"name": "unary_expression", "symbols": ["call_expression"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["string_literal"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["list_literal"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["boolean_literal"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["indexed_access"], "postprocess": id},
    {"name": "unary_expression", "symbols": [{"literal":"("}, "expression", {"literal":")"}], "postprocess": 
        data => data[1]
                },
    {"name": "list_literal", "symbols": [{"literal":"["}, "list_items", {"literal":"]"}], "postprocess": 
        d => ({
            type: "list_literal",
            items: d[1],
            start: tokenStart(d[0]),
            end: tokenEnd(d[2])
        })
                },
    {"name": "list_items", "symbols": [], "postprocess": () => []},
    {"name": "list_items", "symbols": ["_ml", "expression", "_ml"], "postprocess": d => [d[1]]},
    {"name": "list_items", "symbols": ["_ml", "expression", "_ml", {"literal":","}, "list_items"], "postprocess": 
        d => [
            d[1],
            ...d[4]
        ]
                },
    {"name": "boolean_literal", "symbols": [{"literal":"true"}], "postprocess": 
        d => ({
            type: "boolean_literal",
            value: true,
            start: tokenStart(d[0]),
            end: tokenEnd(d[0])
        })
                },
    {"name": "boolean_literal", "symbols": [{"literal":"false"}], "postprocess": 
        d => ({
            type: "boolean_literal",
            value: false,
            start: tokenStart(d[0]),
            end: tokenEnd(d[0])
        })
                },
    {"name": "boolean_literal", "symbols": [{"literal":"maybe"}], "postprocess": 
        d => ({
            type: "boolean_literal",
            value: Math.random() < 0.5,
            start: tokenStart(d[0]),
            end: tokenEnd(d[0])
        })
                },
    {"name": "line_comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": convertTokenId},
    {"name": "string_literal", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": 
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
                },
    {"name": "number", "symbols": [(lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": convertTokenId},
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"fn"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"while"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"for"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"else"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"if"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"return"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"and"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"or"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"true"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"false"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"maybe"}], "postprocess": convertTokenId},
    {"name": "identifier_or_keyword", "symbols": [{"literal":"delete"}], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": ["number"], "postprocess": id},
    {"name": "deletable", "symbols": [{"literal":"-"}, "number"], "postprocess": d => {d[1].value = -d[1].value; return d[1]}},
    {"name": "deletable", "symbols": ["identifier_or_keyword"], "postprocess": id},
    {"name": "deletable", "symbols": [(lexer.has("plus") ? {type: "plus"} : plus)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("multiply") ? {type: "multiply"} : multiply)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("divide") ? {type: "divide"} : divide)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("modulo") ? {type: "modulo"} : modulo)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("gt") ? {type: "gt"} : gt)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("gte") ? {type: "gte"} : gte)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("lt") ? {type: "lt"} : lt)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("lte") ? {type: "lte"} : lte)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("eq") ? {type: "eq"} : eq)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("neq") ? {type: "neq"} : neq)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("streq") ? {type: "streq"} : streq)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("strneq") ? {type: "strneq"} : strneq)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("exstreq") ? {type: "exstreq"} : exstreq)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("exstrneq") ? {type: "exstrneq"} : exstrneq)], "postprocess": convertTokenId},
    {"name": "deletable", "symbols": [(lexer.has("assignment") ? {type: "assignment"} : assignment)], "postprocess": convertTokenId},
    {"name": "_ml$ebnf$1", "symbols": []},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1", "multi_line_ws_char"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_ml", "symbols": ["_ml$ebnf$1"]},
    {"name": "multi_line_ws_char", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "multi_line_ws_char", "symbols": [{"literal":"\n"}]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
]
  , ParserStart: "input"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
