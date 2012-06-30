function Map () {
	return Object.create(Map.prototype, {
		data: {
			value: []
		}
	})
}

Map.prototype = {
	get: function (name) {
		for (var i=0; i<this.data.length; i++) {
			if (name === this.data[i].name) {
				return this.data[i].value
			}
		}

		return null
	},

	set: function (name, value) {
		for (var i=0; i<this.data.length; i++) {
			if (name === this.data[i].name) {
				this.data[i].value = value

				return
			}
		}

		this.data.push({
			name: name,
			value: value
		})
	},

	delete: function (name) {
		for (var i=0; i<this.data.length; i++) {
			if (name === this.data[i].name) {
				this.data.splice(i, 1)

				return
			}
		}
	},

	has: function (name) {
		for (var i=0; i<this.data.length; i++) {
			if (name === this.data[i].name) {
				return true
			}
		}

		return false
	}
}

module.exports = Map
