import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import {
	getAuthorsQuery,
	addBookMutation,
	getBooksQuery,
} from './graphql/queries'
import { flowRight as compose } from 'lodash'

const AddBook = (props) => {
	const [book, setBook] = useState({
		name: '',
		genre: '',
		authorid: '',
	})

	const handleChange = (e) => {
		e.preventDefault()
		// console.log(e.target.name)
		var field = e.target.name
		const newState = { ...book, [field]: e.target.value }
		setBook(newState)
		// console. log(book)
	}
	const displayAuthors = () => {
		var data = props.getAuthorsQuery
		// console.log(data)
		if (data.loading) {
			return <option disabled>Loading Authors</option>
		} else {
			return data.authors.map((a) => {
				return (
					<option key={a.id} name='authorid' value={a.id}>
						{a.name}
					</option>
				)
			})
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		props.addBookMutation({
			variables: {
				name: book.name,
				genre: book.genre,
				authorid: book.authorid,
			},

			refetchQueries: [{ query: getBooksQuery }],
		})
		console.log(book)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='field'>
				<label>Book Name</label>
				<input type='text' name='name' onChange={handleChange} />
			</div>
			<div className='field'>
				<label>Genre</label>
				<input type='text' name='genre' onChange={handleChange} />
			</div>
			<div className='field'>
				<label>Author</label>
				<select name='authorid' onChange={handleChange}>
					<option>Select Author</option>
					{displayAuthors()}
				</select>
			</div>
			<button>+</button>
		</form>
	)
}

export default compose(
	graphql(getAuthorsQuery, { name: 'getAuthorsQuery' }),
	graphql(addBookMutation, { name: 'addBookMutation' })
)(AddBook)
