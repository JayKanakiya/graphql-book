const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors())

const uri = 'mongodb://127.0.0.1:27017/booklist?authSource=admin'

const serverOptions = {
	socketTimeoutMS: 30000,
	keepAlive: true,
	reconnectTries: 30000,
	useNewUrlParser: true,
}
mongoose
	.connect(uri, serverOptions)
	.then((res) => {
		console.log('mongodb connected')
	})
	.catch((err) => {
		console.log(Error, err.message)
	})

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true,
	})
)

app.listen(4000, () => {
	console.log('Listening at 4000')
})
