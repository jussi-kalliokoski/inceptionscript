var fs = require('fs')
var Path = require('path')
var State = require('../parser/state')

function load (state, path) {
	var content

	content = fs.readFileSync(path, 'utf8')

	var s = new State(state.parser, content, path, state)

	state.output += s.output
}

module.exports = function (sandbox) {
	sandbox.include = function () {
		var state = sandbox.__state__

		for (var i=0; i<arguments.length; i++) {
			load(state, arguments[i])
		}
	}
}
