var Script = process.binding('evals').NodeScript
var runScript = Script.runInNewContext
var Map = require('../map')
var Module = require('module')
var path = require('path')

function concatTokens (tokens) {
	var a = ''

	for (var i=0; i<tokens.length; i++) {
		a += tokens[i].value
	}

	return a
}

module.exports = function (parser) {
	var curState

	var sandbox = {
		require: function (filename) {
			return require(filename[0] === '.' ?
				path.join(path.dirname(curState.fullPath),
				filename) : filename
			)
		},

		console: console,

		parser: null,

		defines: Map(),

		ENV: process.env,

		get __state__ () {
			return curState
		},

		get __fullpath__ () {
			return curState.fullPath
		},

		get __dir__ () {
			return curState.dir
		},

		get __file__ () {
			return curState.filename
		},

		get __path__ () {
			return curState.path
		},

		get __line__ () {
			return curState.line
		},

		get __col__ () {
			return curState.col
		}
	}

	sandbox.global = sandbox

	parser.sandbox = sandbox

	require('./include')(sandbox)
	require('./define-token')(sandbox)
	require('./define-macro')(sandbox)
	require('./define-block')(sandbox)

	parser.on('token', function (token, state) {
		var print, out

		if (state.incepting) {
			if (token.value === '``') {
				state.suppressNext = true

				if (state.incepting[0].value === '=') {
					print = state.incepting.shift()
				}

				out = runScript(concatTokens(state.incepting),
					sandbox, state.path, true)

				if (print) state.output += out
				delete state.incepting

				return
			}

			state.incepting.push(token)
		} else {
			if (token.value === '``') {
				state.suppress = true

				state.incepting = []
			}
		}
	})

	parser.setState = function (state) {
		curState = state
	}
}
