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

function resolve (filename, fn, extensions) {
	var ext, exts, fullname, realpath

	fullname = path.resolve(filename)
	ext = path.extname(fullname)

	if (!extensions) {
		try {
			return check(filename, fullname, ext)
		} catch (e) {
			throw Error(fn + ': "' + filename + '" could not be found')
		}
	}

	if (ext in extensions) {
		return check(filename, fullname, ext)
	}

	exts = Object.keys(extensions)

	while (exts.length) {
		ext = exts.shift()
		try {
			return check(filename, fullname + ext, ext)
		} catch (e) {}
	}

	throw Error(fn + ': "' + filename + '" could not be found')
}

function load (state, filename) {
	var content

	filename = resolve(filename, 'include', extensions)

	if (memoized[filename]) {
		content = memoized[filename]
	} else {
		content = memoized[filename] = fs.readFileSync(filename, 'utf8')
	}

	var s = new State(state.parser, content, filename, state)

	state.output += s.output
}

function read (filename) {
	filename = resolve(filename, 'read')

	return fs.readFileSync(filename, 'utf8')
}

module.exports = function (sandbox) {
	sandbox.include = function () {
		var state = sandbox.__state__

		for (var i=0; i<arguments.length; i++) {
			load(state, path.join(state.dir, arguments[i]))
		}
	}

	sandbox.read = function () {
		var state = sandbox.__state__
		var r = ''

		for (var i=0; i<arguments.length; i++) {
			r += read(path.join(state.dir, arguments[i]))
		}

		return r
	}
}
