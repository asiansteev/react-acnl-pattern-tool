import React from 'react';
import { Search } from 'react-spotify-api'

class MySearch extends React.Component {
	constructor(props) {
		super(props);
		console.log('WHAT')
		
		this.converterSetting = React.createRef();
		this.searcher = React.createRef();
		this.handleQueryChange = this.handleQueryChange.bind(this);

		// this.query = React.createRef();

		this.state = {
			loaderPart: 1,
			loaderData : "",
			query : 'direct hit!',
		}
	}

  handleQueryChange(query) {
  	this.setState({query})
  }

	render() {
		// const { search } = this.state;
		// const spotifyApiKey = 'BQDdyyu4B-2wJynT55L79nEE1BaDr-4OhYrplVLBtQNWlO-u19Gg2JhjHe5UqgJU1bqTRLFwKudc4XQ_BgG4EvmaKCE2hq8XXxC0qpcXziZQ_1LwP59JekYEqF1o9DjzGw67PKs3pva1Jo8'
		// this.setState({album_art: data.albums.items[0].images[2].url})
		const query = this.state.query;
		console.log(this.state)
		console.log("HIHIHIHIHIHI")
		return (
			<div>
				<Search
				  query={query}
				  album
				  artist
				  onQueryChange={this.handleQueryChange}>
				    {(data) =>
				        data ? (
				            <ul>
				                <li>Albums</li>
				                <ul>
				                    {data.albums.items.map(album => (
				                        <li key={album.id}>{album.name}</li>
				                    ))}
				                </ul>
				                <li>Artists</li>
				                <ul>
				                    {data.artists.items.map(artist => (
				                        <li key={artist.id}>{artist.name}</li>
				                    ))}
				                </ul>
				            </ul>
				        ) : null
				    }
				</Search>
			</div>
	);
}}
export default MySearch;