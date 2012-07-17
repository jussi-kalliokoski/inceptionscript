var fs = require('fs')
var path = require('path')
var State = require('../parser/state')

var memoized = {}
var extensions = {'.js':''}

function check (filename, filepath, ext) {
	var stat = fs.statSync(filepath)

	if (stat.isDirectory()) throw ''

	return fs.realpathSync(filepath)
}

function resolve (filename) {
	var ext, exts, fullname, realpath

	fullname = path.resolve(filename)

	if ((ext = path.extname(fullname)) in extensions) {
		return check(filename, fullname, ext)
	}

	exts = Object.keys(extensions)

	while (exts.length) {
		ext = exts.shift()
		try {
			return check(filename, fullname + ext, ext)
		} catch (e) {}
	}

	throw Error('include: "' + filename + '" could not be found')
}

function load (state, filename) {
	var content

	filename = resolve(filename)

	if (memoized[filename]) {
		content = memoized[filename]
	} else {
		content = memoized[filename] = fs.readFileSync(filename, 'utf8')
	}

	var s = new State(state.parser, content, filename, state)

	state.output += s.output
}

module.exports = function (sandbox) {
	sandbox.include = function () {
		var state = sandbox.__state__

		for (var i=0; i<arguments.length; i++) {
			load(state, path.join(state.dir, arguments[i]))
		}
	}
}
