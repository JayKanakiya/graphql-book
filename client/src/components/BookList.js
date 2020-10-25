import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { getBooksQuery } from './graphql/queries'
import BookDetails from './BookDetails'

const BookList = (props) => {
	const [ID, setID] = useState()

	const displayBooks = () => {
		var data = props.data
		if (data.loading) {
			return <div>Loading Books</div>
		} else {
			console.log(data)
			return data.books.map((i) => {
				return (
					<li
						key={i.id}
						onClick={(e) => {
							setID(i.id)
						}}
					>
						{i.name}
					</li>
				)
			})
		}
	}

	return (
		<div id='container'>
			<ul id='movie-list'>{displayBooks()}</ul>
			<BookDetails bookID={ID} />
		</div>
	)
}

export default graphql(getBooksQuery)(BookList)
