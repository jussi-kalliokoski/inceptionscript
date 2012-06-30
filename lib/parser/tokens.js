module.exports = {
	"KeyWord": { "test": [
		'break', 'case', 'catch', 'continue', 'default', 'delete',
		'do', 'else', 'false', 'final', 'finally', 'for', 'function',
		'if', 'in', 'instanceof', 'new', 'null', 'return', 'switch',
		'this', 'throw', 'true', 'try', 'typeof', 'var', 'void',
		'while', 'with', 'arguments'
	], "inherits": 'Identifier' },

	"Identifier": /^[a-z_\$][a-z_\$\d]*/i,

	"Comment": /^((\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/[^\n\r]+))/,

	"RegExp": /^\/(\\[^\x00-\x1f]|\[(\\[^\x00-\x1f]|[^\x00-\x1f\\\/])*\]|[^\x00-\x1f\\\/\[])+\/[gim]*/,

	"String": /^(("([^"\\]|\\.)*")|('([^'\\]|\\.)*'))/,

	"Number": /^((0x[\da-f]+)|(0[0-7]+)|((0|([1-9]\d*))e(\+|-)?\d+)|(0?\.\d+)|([1-9]\d*(\.\d+)?)|0)/i,

	"Whitespace": /^[\n\t\r ]+/,

	"Operator": [
		'>>>=', '===', '!==', '>>>', '<<=', '>>=', 
		'<=', '>=', '==', '!=', '++', '--', '<<', '>>', '&&', '||',
		'+=', '-=', '*=', '%=', '&=', '|=', '^=', '/=',
		'(', ')', '.', ';', ',', '<', '>', '+',
		'-', '*', '%', '&', '|', '^', '!', '~', '?', ':', '=', '/'
	],

	"Bracket": [
		'{', '}', '[', ']'
	]
}
