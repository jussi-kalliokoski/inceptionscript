module.exports = function (state) {
	return function (token) {
		if (state.override) {
			return state.override(token, state)
		}

		var d = state.parser.sandbox.defines.get(token.value)
		if (d != null) {
			return d(token, state)
		}
	}
}
