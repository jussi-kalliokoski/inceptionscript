var Path = require('path')

function State (parser, source, path, prevState) {
	this.parser = parser
	this.source = source || this.source
	this.path = path || this.path
	this.fullPath = Path.resolve(this.path)
	this.dir = Path.dirname(this.path)
	this.filename = Path.basename(this.path)
	this.prevState = prevState || this.prevState

	this.parser.setState(this)

	this.isDefined = require('../modules/define')(this)

	var tokens = parser.tokens

	var i, s, t, p

	this.left = source

	parsing: while (this.left) {
		for (i=0; i<tokens.length; i++) {
			s = tokens[i].test(this.left)

			if (!s) continue

			this.lastToken = this.currentToken
			this.currentToken = {
				name: tokens[i].name,
				value: s
			}

			this.left = this.left.substr(s.length)

			if (!this.isDefined(this.currentToken, this)) {
				parser.emit('token', this.currentToken, this)
			}

			t = s.split(/\r\n|\n|\r/)

			if (t.length > 1) {
				t.line += t.length - 1
				t.col = 0
			}

			t.col += t[t.length - 1].length

			if (this.suppress) {
				if (this.suppressNext) {
					this.suppress = false
					this.suppressNext = false
				}
			} else {
				this.output += s
			}

			continue parsing
		}

		parser.emit("unknownSymbol", this.left[0], this)

		if (p === this.left) {
			throw Error("Undefined symbol in " + path + "(line " +
				this.line + ", col " + this.col + ")")
		}

		p = this.left

	}

	this.parser.setState(this.prevState)
}

State.prototype = {
	parser: null,
	prevState: null,
	source: '',
	path: '',
	left: '',
	output: '',

	currentToken: null,
	lastToken: null,

	line: 0,
	col: 0,

	suppress: false,
	suppressNext: false
}

module.exports = State
