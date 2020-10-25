const graphql = require('graphql')
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
} = graphql
const _ = require('lodash')
const Book = require('../models/Book')
const Author = require('../models/Author')
const { at } = require('lodash')

// const books = [
// 	{ name: 'The First Door', genre: 'Educational', id: '1', authorid: '2' },
// 	{ name: 'The Second Door', genre: 'Educational', id: '2', authorid: '3' },
// 	{ name: 'The Third Door', genre: 'Educational', id: '3', authorid: '1' },
// 	{ name: 'The Time', genre: 'Educational', id: '4', authorid: '2' },
// 	{ name: 'The Wine', genre: 'Educational', id: '5', authorid: '3' },
// 	{ name: 'The Mine', genre: 'Educational', id: '6', authorid: '1' },
// ]

// const authors = [
// 	{ name: 'Jay K', age: 22, id: '1' },
// 	{ name: 'Samosn', age: 50, id: '2' },
// 	{ name: 'Bertram', age: 45, id: '3' },
// ]

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				if (parent.authorid) {
					return Author.findById(parent.authorid)
				} else {
					return null
				}
			},
		},
	}),
})
const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: GraphQLList(BookType),
			resolve(parent, args) {
				return Book.find({ authorid: parent.id })
			},
		},
	}),
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Book.findById(args.id)
			},
		},

		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Author.findById(args.id)
			},
		},

		books: {
			type: GraphQLList(BookType),
			resolve(parent, args) {
				return Book.find({})
			},
		},

		authors: {
			type: GraphQLList(AuthorType),
			resolve(parent, args) {
				return Author.find({})
			},
		},
	},
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: GraphQLString },
				age: { type: GraphQLInt },
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name,
					age: args.age,
				})
				return author.save()
			},
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: GraphQLString },
				genre: { type: GraphQLString },
				authorid: { type: GraphQLID },
			},
			resolve(parent, args) {
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorid: args.authorid,
				})
				return book.save()
			},
		},
	},
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
})
