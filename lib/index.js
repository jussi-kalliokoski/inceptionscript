function Incepter () {
	this.parser = new Incepter.Parser()

	require('./modules/incepter')(this.parser)
}

Incepter.prototype = {
	parse: function () {
		return this.parser.parse.apply(this.parser, arguments)
	}
}

Incepter.Parser = require('./parser')

Incepter.Parser.tokens.Incepter = /^``/

module.exports = Incepter
