``

defineToken('lol', 'watzorgol = 22;')

defineMacro('add', function (state, args) {
	return args.map(function (a) {
		return a.map(function (b) {
			return b.value
		}).join('')
	}).join(' + ')
})

defineBlock('replace', function (state, args, block) {
	var a = args[0][0].value
	var b = args[1][0].value

	return block.map(function (c) {
		return c.value === a ? b : c.value
	}).join('')
})

``

add(1, 2, 3)

lol lol lol

replace(tom, cat) {
	tom went looking for dogs and found a tomberry pie
}
