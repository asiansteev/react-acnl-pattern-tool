import React from 'react';
import qrcode from "./jsqrcode.js";
// import { SearchBar } from 'react-native-elements';
import { Search } from 'react-spotify-api';
import { SpotifyApiContext } from 'react-spotify-api';

// handles all imports for the tool
// will do both qr detection and image conversion
class EditorImporter extends React.Component {
	constructor(props) {
		super(props);
		
		this.converterSetting = React.createRef();
		this.searcher = React.createRef();

		// this.query = React.createRef();

		this.state = {
			loaderPart: 1,
			loaderData : "",
			query : 'direct hit!',
		}
	}

	onSearch() {
		this.setState({
			query : 'anything else'
		});
    let fileReader = new FileReader();
			// fileReader.onload = (event) => {
				let img = new Image();
				img.onload = () => {
					// using canvas to convert
					let canvasEle = document.createElement('canvas');
					canvasEle.width = 32;
					canvasEle.height = 32;
					
					let context = canvasEle.getContext("2d");

					// canvas will automatically scale image down for us to desired pixel grid
					context.drawImage(img, 0, 0, 32, 32);
					
					let imgData = context.getImageData(0, 0, 32, 32);

					let convSet = this.converterSetting.current.value;

					// determine conversion method, pass it up
					this.props.convert(imgData, convSet);
				};

				// direct hit
				let rc = 'https://i.scdn.co/image/ab67616d0000b273b6fd3e0525827a9dd794a556';

				// rough customers
				// let rc = 'https://i.scdn.co/image/ab67616d0000b273b49cfc30159b7d06ee9c89e6'

				var request = new XMLHttpRequest();
				request.open('GET', rc, true);
				request.responseType = 'blob';
				request.onload = function() {
				    var reader = new FileReader();
				    reader.readAsDataURL(request.response);
				    reader.onload =  function(e){
				    	img.src = e.target.result;
				        console.log('DataURL:', e.target.result);
				    };
				};
				request.send();
    // };
	};

	shouldComponentUpdate() {
		// no need to update
		return false;
	};


	render() {
		const { search } = this.state;
		const spotifyApiKey = 'XXX'

		return (
			<div>
				<SpotifyApiContext.Provider value={spotifyApiKey}>


					<div>
						<span className="metadata-label">Convert Image</span>
						<select ref = {this.converterSetting} defaultValue = {"top"}>
							<option value="top">Use top 15 most-used nearest colors (ugly, fast)</option>
							<option value="lowest">Optimize out of top 40 most-used nearest colors (best, slow)</option>
							<option value="grey">Convert to greyscale (fast, pre-determined colors)</option>
							<option value="sepia">Convert to sepia (fast, pre-determined colors)</option>
						</select>
					</div>

					<div>
					<span className="metadata-label">Search</span>
						{/*<SearchBar*/}
					  <input
					    ref = {this.searcher}
					    type="string"
					    onChange = {this.onSearch.bind(this)}
					  />
					</div>

					<Search query={this.state.query} album artist>

			    {({data}) =>
			        data ? (
			            <ul>
			                <li>Albums</li>
			                <ul>
			                    {data.albums.items.map(album => (
			                    	  <div key={album.id}>
				                        <li>{album.name}</li>
				                        <li><img src={album.images[0].url}/></li>
				                      </div>
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
				</SpotifyApiContext.Provider>
			</div>
		);
	}
}

export default EditorImporter;
