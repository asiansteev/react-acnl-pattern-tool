import React from 'react';
// import qrcode from "./jsqrcode.js";

// handles all imports for the tool
// will do both qr detection and image conversion
class EditorImporter extends React.Component {
	constructor(props) {
		super(props);
		
		this.converterSetting = React.createRef();
		this.searcher = React.createRef();
		this.handleChange = this.handleChange.bind(this);

		this.state = {
			loaderPart: 1,
			loaderData : "",
		}
	}

	shouldComponentUpdate() {
		// no need to update
		return false;
	};

  handleChange(e) {
  	this.setState({art_url: this.props.art_url})
  	this.props.onQueryChange(e.target.value);
  	this.setState({query: e.target.value})
  }

  componentWillReceiveProps(nextProps) {
  	if (nextProps.art_url !== this.props.art_url) {
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

			let rc = nextProps.art_url

			var request = new XMLHttpRequest();
			request.open('GET', rc, true);
			request.responseType = 'blob';
			request.onload = function() {
			    var reader = new FileReader();
			    reader.readAsDataURL(request.response);
			    reader.onload =  function(e){
			    	img.src = e.target.result;
			        // console.log('DataURL:', e.target.result);
			    };
			};
			request.send();
		}
  }
	render() {
		return (
			<div >
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
					  value={this.state.query}
				    ref = {this.searcher}
				    type="string"
			    	onChange = {this.handleChange}
				  />
				</div>
			</div>
		);
	}
}

export default EditorImporter;
