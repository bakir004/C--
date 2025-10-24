const moo = require("moo");

const lexer = moo.compile({
  WS: /[ \t]+/,
  keyword: ['let', 'print'],
  identifier: /[a-zA-Z_][a-zA-Z0-9_]*/,
  number:  /[0-9]+/,
  assign:  '=',
  lparen:  '(',
  rparen:  ')',
  semicolon: ';',
});

module.exports = lexer;
