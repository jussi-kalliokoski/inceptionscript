var EventEmitter = require('events').EventEmitter

function defineValue (obj, name, value) {
	Object.defineProperty(obj, name, {
		value: value,
		writable: true,
		configurable: true,
		enumerable: false
	})
}

function extend (obj) {
	var k, i

	for (i=1; i<arguments.length; i++) {
		for (k in arguments[i]) {
			if (arguments[i].hasOwnProperty(k)) {
				obj[k] = arguments[i][k]
			}
		}
	}

	return obj
}

function sortCopy (arr) {
	return arr.slice().sort(function (a, b) {
		return	a.length > b.length ? 1 :
			a.length < b.length ? -1 : 0
	})
}

function Parser () {
	EventEmitter.call(this)

	defineValue(this, "tokens", Object.keys(Parser.tokens)
		.map(Parser.createToken
			.bind(Parser, Parser.tokens)))
}

Parser.prototype = extend(new EventEmitter, {
	tokens: null,
	unknownName: 'UNKNOWN',

	parse: function (str, path) {
		var state = new Parser.State(this, str, path, null)

		return state.output
	}
})

Parser.createToken = function (tokens, name) {
	var match = tokens[name]

	if (Array.isArray(match)) {
		match = sortCopy(match)

		return { test: function (str) {
			for (var i=0; i<match.length; i++) {
				if (str.substr(0, match[i].length) === match[i]) {
					return match[i]
				}
			}

			return null
		}, name: name }
	}

	if (match instanceof RegExp) {
		return { test: function (str) {
			var m = match.exec(str)

			return m && m[0]
		}, name: name }
	}

	if (match instanceof Object) {
		var inherits = Parser.createToken(tokens, match.inherits).test
		match = match.test

		if (Array.isArray(match)) {
			var l = sortCopy(match)
			match = function (str) {
				if (l.indexOf(str) !== -1) return str

				return null
			}
		} else {
			match = Parser.createToken({a: match}, 'a').test
		}

		return { test: function (str) {
			var r = inherits(str)

			if (!r) return r

			return match(r)
		}, name: name }
	}

	throw TypeError("Invalid type for token creation");
}

Parser.tokens = require('./tokens')
Parser.State = require('./state')

module.exports = Parser
