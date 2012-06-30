function defineToken (name, value) {
	if (this.defines.has(name)) {
		throw ReferenceError(name + ' is already defined')
	}

	var sandbox = this

	this.defines.set(name, function () {
		sandbox.__state__.suppress = true
		sandbox.__state__.suppressNext = true

		sandbox.__state__.left = value + sandbox.__state__.left
	})
}

module.exports = function (sandbox) {
	sandbox.defineToken = defineToken.bind(sandbox)
}
