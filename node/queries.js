const _ = require('lodash')

module.exports.set = async function set(Model, query) {
	obj = _.omit(query, ['operation', 'Category'])
	console.log(obj)
	let app = await Model.findOneAndUpdate({ Category: query.Category, App: query.App }, obj)
	
	app = await Model.find({App:query.App})
	console.log(app)
}

module.exports.deleteCells = async function deleteCells(Model, query) {
	obj = _.omit(query, ['operation', 'App', 'Category'])
	Object.keys(obj).forEach(o => {
        obj[o] = 1
    })
	console.log(obj)
	let app = await Model.findOneAndUpdate({ Category: query.Category, App: query.App }, { $unset: obj})
	
	app = await Model.find({App:query.App})
	console.log(app)
}

module.exports.deleteRow = async function deleteRow(Model, query) {
	await Model.findOneAndDelete({ Category: query.Category, App: query.App })
}

module.exports.read = async function read(Model, query) {
	let app = await Model.find({ Category: query.Category, App: query.App })
    console.log(app)
	return app;
}

module.exports.addRow = async function addRow(Model, query) {
	obj = _.omit(query, ['operation'])
	console.log(obj)
	let app = await Model.create(obj)
    console.log(app)
}

