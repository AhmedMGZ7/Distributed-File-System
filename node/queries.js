

module.exports.set = async function set(Model, row_key, obj) {
	let [cat, name] = row_key.split('$')
	console.log(cat, name)
	let app = await Model.findOneAndUpdate({ Category: cat, App: name }, obj)
	
	app = await Model.find({App:name})
	console.log(app)
}
module.exports.deleteCells = async function deleteCells(Model, row_key, columns) {
	let [cat, name] = row_key.split('$')
	var obj = {}
	columns.forEach(element => {
		obj[element] = ''
	});
	columns.reduce((acc, curr) => (acc[curr] = '', acc), {})
	console.log(obj)
	let app = await Model.findOneAndUpdate({ Category: cat, App: name }, { $unset: obj})
	
	app = await Model.find({App:name})
	console.log(app)
}

module.exports.deleteRow = async function deleteRow(Model, row_key) {
	let [cat, name] = row_key.split('$')
	console.log(cat, name)
	await Model.findOneAndDelete({ Category: cat, App: name })
}

module.exports.read = async function read(Model, row_key) {
	let [cat, name] = row_key.split('$')
	console.log(cat, name)
	let app = await Model.find({ Category: cat, App: name })
    console.log(app)
	return app;
}

module.exports.addRow = async function addRow(Model, row_key, obj) {
	let [cat, name] = row_key.split('$')
	console.log(cat, name)
	let app = await Model.create(obj)
    console.log(app)
}

