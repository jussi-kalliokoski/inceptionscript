function trim (expr) {
	while (expr.length && expr[0].name === 'Whitespace') {
		expr.shift()
	}

	while (expr.length && expr[expr.length - 1].name === 'Whitespace') {
		expr.pop()
	}

	return expr
}

function defineMacro (name, callback) {
	if (this.defines.has(name)) {
		throw ReferenceError(name + ' is already defined')
	}

	var sandbox = this

	this.defines.set(name, function (token, state) {
		var buffer = [token]
		var openParens = 0
		var expressions = []
		var expr

		function abort (friendly) {
			state.suppressNext = true
			state.override = null

			if (friendly) return

			state.output += buffer.shift().value
			state.left = buffer.map(function (b) {
				return b.value
			}).join('') + state.left
		}

		state.suppress = true

		state.override = function (token, state) {
			buffer.push(token)

			switch (token.value) {
			case "(":
				if (++openParens === 1) {
					expr = []
				} else {
					expr.push(token)
				}

				break
			case ")":
				if (--openParens === 0) {
					if (expr.length) expressions.push(trim(expr))

					var s = callback(state, expressions)

					if (s != null) {
						state.left = s + state.left
					}

					abort(true)
				} else if (openParens < 0) {
					abort()
				} else {
					expr.push(token)
				}

				break
			case ",":
				switch (openParens) {
				case 0:
					abort()
					break
				case 1:
					expressions.push(trim(expr))
					expr = []
					break
				default:
					expr.push(token)
				}

				break
			default:
				if (openParens === 0) {
					if (token.name !== 'Whitespace') {
						abort()
					}

					break
				} else {
					expr.push(token)
				}
			}

			return true
		}

		return true
	})
}

module.exports = function (sandbox) {
	sandbox.defineMacro = defineMacro.bind(sandbox)
}
